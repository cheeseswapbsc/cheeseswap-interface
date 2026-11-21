import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { ethers } from 'ethers'
import { disconnectWallet, setupWalletListeners, WalletType, CHAIN_ID } from '../connectors'
import { eip6963Store, EIP6963ProviderDetail } from '../connectors/eip6963'
import { eip6963Connector } from '../connectors/wallets/EIP6963Connector'
import { walletConnectConnector } from '../connectors/WalletConnectProvider'
import { ConnectorFactory } from '../connectors/ConnectorFactory'
import { walletTypeToConnectorId } from '../connectors'
import { ensureBSCMainnet } from '../connectors/utils'

const STORAGE_KEY = 'cheeseswap:wallet'
const LEGACY_STORAGE_KEY = 'selectedWallet'

interface PersistedConnection {
  version: 2
  walletType: WalletType
  rdns: string | null
}

/** Metadata about the currently connected wallet (modern, EIP-6963 aware) */
export interface ConnectedWalletMeta {
  name: string
  icon: string | null
  rdns: string | null
}

interface Web3ContextType {
  account: string | null
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  chainId: number | null
  connect: (walletType: WalletType, rdns?: string) => Promise<void>
  disconnect: () => Promise<void>
  switchNetwork: () => Promise<void>
  isConnected: boolean
  isWrongNetwork: boolean
  walletType: WalletType | null
  walletMeta: ConnectedWalletMeta | null
  discoveredWallets: EIP6963ProviderDetail[]
  error: string | null
  clearError: () => void
  isConnecting: boolean
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function useWeb3(): Web3ContextType {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider')
  }
  return context
}

/** Map legacy WalletType identifiers to well-known EIP-6963 rdns values */
const WALLET_TYPE_TO_RDNS: { [key in WalletType]?: string[] } = {
  METAMASK: ['io.metamask', 'io.metamask.flask'],
  TRUST_WALLET: ['com.trustwallet.app'],
  OKX_WALLET: ['com.okex.wallet'],
  BINANCE: ['com.binance.wallet'],
  COINBASE: ['com.coinbase.wallet']
}

/** Map a discovered rdns back to a legacy WalletType (for existing UI) */
export function rdnsToWalletType(rdns: string): WalletType {
  const lower = rdns.toLowerCase()
  if (lower.startsWith('io.metamask')) return 'METAMASK'
  if (lower === 'com.trustwallet.app') return 'TRUST_WALLET'
  if (lower === 'com.okex.wallet') return 'OKX_WALLET'
  if (lower === 'com.binance.wallet') return 'BINANCE'
  if (lower === 'com.coinbase.wallet') return 'COINBASE'
  return 'INJECTED'
}

function readPersistedConnection(): PersistedConnection | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.walletType) {
        return { version: 2, walletType: parsed.walletType, rdns: parsed.rdns || null }
      }
    }
    // Migrate from the legacy key
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY) as WalletType | null
    if (legacy) {
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      const migrated: PersistedConnection = { version: 2, walletType: legacy, rdns: null }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
      return migrated
    }
  } catch (err) {
    console.warn('[Web3Provider] Failed to read persisted connection:', err)
  }
  return null
}

function persistConnection(connection: PersistedConnection | null): void {
  try {
    if (connection) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(connection))
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    }
  } catch (err) {
    console.warn('[Web3Provider] Failed to persist connection:', err)
  }
}

interface Web3ProviderProps {
  children: React.ReactNode
}

interface WalletState {
  account: string | null
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  chainId: number | null
  walletType: WalletType | null
  walletMeta: ConnectedWalletMeta | null
}

const EMPTY_STATE: WalletState = {
  account: null,
  provider: null,
  signer: null,
  chainId: null,
  walletType: null,
  walletMeta: null
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [state, setState] = useState<WalletState>(EMPTY_STATE)
  const [discoveredWallets, setDiscoveredWallets] = useState<EIP6963ProviderDetail[]>(() =>
    eip6963Store.getProviders()
  )
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const stateRef = useRef(state)
  stateRef.current = state

  // Track EIP-6963 wallet announcements live
  useEffect(() => {
    const unsubscribe = eip6963Store.subscribe(setDiscoveredWallets)
    eip6963Store.requestProviders()
    return unsubscribe
  }, [])

  const applyProvider = useCallback(
    async (
      provider: ethers.providers.Web3Provider,
      walletType: WalletType,
      meta: ConnectedWalletMeta
    ): Promise<void> => {
      const signer = provider.getSigner()
      const account = await signer.getAddress()
      const network = await provider.getNetwork()

      setState({
        provider,
        signer,
        account,
        chainId: network.chainId,
        walletType,
        walletMeta: meta
      })

      persistConnection({ version: 2, walletType, rdns: meta.rdns })
    },
    []
  )

  const connect = useCallback(
    async (walletType: WalletType, rdns?: string) => {
      setIsConnecting(true)
      setError(null)

      try {
        let provider: ethers.providers.Web3Provider
        let meta: ConnectedWalletMeta

        // Resolve the modern EIP-6963 provider when possible
        let resolvedRdns = rdns
        if (!resolvedRdns && walletType !== 'WALLETCONNECT') {
          const candidates = WALLET_TYPE_TO_RDNS[walletType] || []
          for (const candidate of candidates) {
            if (eip6963Store.getProvider(candidate)) {
              resolvedRdns = candidate
              break
            }
          }
          // Generic request: prefer any single discovered wallet
          if (!resolvedRdns && walletType === 'INJECTED') {
            const all = eip6963Store.getProviders()
            if (all.length === 1) {
              resolvedRdns = all[0].info.rdns
            }
          }
        }

        if (resolvedRdns && eip6963Store.getProvider(resolvedRdns)) {
          provider = await eip6963Connector.connect(resolvedRdns)
          const detail = eip6963Store.getProvider(resolvedRdns)
          meta = {
            name: detail ? detail.info.name : 'Browser Wallet',
            icon: detail ? detail.info.icon : null,
            rdns: resolvedRdns
          }
          walletType = rdns ? rdnsToWalletType(resolvedRdns) : walletType
        } else {
          // Legacy path: WalletConnect, Coinbase SDK, Binance, window.ethereum flags
          const connectorId = walletTypeToConnectorId(walletType)
          provider = await ConnectorFactory.connect(connectorId)
          meta = {
            name: ConnectorFactory.getConnector(connectorId).getName(),
            icon: null,
            rdns: null
          }
        }

        await applyProvider(provider, walletType, meta)
        console.log('[Web3Provider] Connected:', meta.name)
      } catch (err) {
        console.error('[Web3Provider] Error connecting to wallet:', err)
        setError((err as any).message || 'Failed to connect wallet')
        throw err
      } finally {
        setIsConnecting(false)
      }
    },
    [applyProvider]
  )

  const disconnect = useCallback(async () => {
    const { walletType, walletMeta } = stateRef.current
    try {
      if (walletMeta && walletMeta.rdns) {
        await eip6963Connector.disconnect()
      } else if (walletType) {
        await disconnectWallet(walletType)
      }
    } catch (err) {
      console.error('[Web3Provider] Error disconnecting wallet:', err)
    }
    persistConnection(null)
    setState(EMPTY_STATE)
    setError(null)
    console.log('[Web3Provider] Disconnected from wallet')
  }, [])

  const switchNetwork = useCallback(async () => {
    const { provider } = stateRef.current
    if (!provider) return
    try {
      await ensureBSCMainnet((provider as any).provider || provider)
    } catch (err) {
      console.error('[Web3Provider] Failed to switch network:', err)
      setError((err as any).message || 'Failed to switch network')
    }
  }, [])

  // Eager (silent) reconnect on mount - never opens a wallet popup
  useEffect(() => {
    let cancelled = false

    async function eagerConnect() {
      const persisted = readPersistedConnection()
      if (!persisted || stateRef.current.account) return

      try {
        if (persisted.walletType === 'WALLETCONNECT') {
          const provider = await walletConnectConnector.eagerConnect()
          if (provider && !cancelled) {
            await applyProvider(provider, 'WALLETCONNECT', {
              name: 'WalletConnect',
              icon: null,
              rdns: null
            })
          }
          return
        }

        // EIP-6963 silent reconnect by rdns (preferred)
        let rdns = persisted.rdns
        if (!rdns) {
          const candidates = WALLET_TYPE_TO_RDNS[persisted.walletType] || []
          for (const candidate of candidates) {
            if (await eip6963Store.waitForProvider(candidate, 500)) {
              rdns = candidate
              break
            }
          }
        }

        if (rdns) {
          const provider = await eip6963Connector.eagerConnect(rdns)
          if (provider && !cancelled) {
            const detail = eip6963Store.getProvider(rdns)
            await applyProvider(provider, persisted.walletType, {
              name: detail ? detail.info.name : 'Browser Wallet',
              icon: detail ? detail.info.icon : null,
              rdns
            })
          }
          return
        }

        // Legacy fallback: silent eth_accounts probe on window.ethereum
        const injected: any = typeof window !== 'undefined' ? (window as any).ethereum : undefined
        if (injected && typeof injected.request === 'function') {
          const accounts: string[] = await injected.request({ method: 'eth_accounts' })
          if (accounts && accounts.length > 0 && !cancelled) {
            const provider = new ethers.providers.Web3Provider(injected, 'any')
            await applyProvider(provider, persisted.walletType, {
              name: 'Browser Wallet',
              icon: null,
              rdns: null
            })
          }
        }
      } catch (err) {
        console.warn('[Web3Provider] Eager reconnect failed:', err)
      }
    }

    eagerConnect()
    return () => {
      cancelled = true
    }
  }, [applyProvider])

  // Wallet event listeners: react to account/chain changes without reloading
  useEffect(() => {
    if (!state.provider) return

    const eip1193 = (state.provider as any).provider

    const cleanup = setupWalletListeners(
      eip1193,
      (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else if (accounts[0] !== stateRef.current.account) {
          const provider = stateRef.current.provider
          setState(prev => ({
            ...prev,
            account: accounts[0],
            signer: provider ? provider.getSigner() : prev.signer
          }))
        }
      },
      (chainIdHex: string) => {
        const nextChainId = typeof chainIdHex === 'string' ? parseInt(chainIdHex, 16) : Number(chainIdHex)
        if (!Number.isNaN(nextChainId)) {
          // Modern behaviour: update state instead of reloading the page
          setState(prev => ({ ...prev, chainId: nextChainId }))
        }
      },
      () => {
        disconnect()
      }
    )

    return cleanup
  }, [state.provider, disconnect])

  const clearError = useCallback(() => setError(null), [])

  const value: Web3ContextType = {
    ...state,
    connect,
    disconnect,
    switchNetwork,
    isConnected: !!state.account,
    isWrongNetwork: state.chainId !== null && state.chainId !== CHAIN_ID,
    discoveredWallets,
    error,
    clearError,
    isConnecting
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export { Web3Context }
