import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { connectWallet, disconnectWallet, setupWalletListeners, WalletType } from '../connectors'

interface Web3ContextType {
  account: string | null
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  chainId: number | null
  connect: (walletType: WalletType) => Promise<void>
  disconnect: () => Promise<void>
  isConnected: boolean
  walletType: WalletType | null
  error: string | null
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

interface Web3ProviderProps {
  children: React.ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [state, setState] = useState<{
    account: string | null
    provider: ethers.providers.Web3Provider | null
    signer: ethers.Signer | null
    chainId: number | null
    walletType: WalletType | null
  }>({
    account: null,
    provider: null,
    signer: null,
    chainId: null,
    walletType: null
  })

  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = useCallback(async (walletType: WalletType) => {
    setIsConnecting(true)
    setError(null)

    try {
      const provider = await connectWallet(walletType)
      const signer = provider.getSigner()
      const account = await signer.getAddress()
      const network = await provider.getNetwork()

      setState({
        provider,
        signer,
        account,
        chainId: network.chainId,
        walletType
      })

      // Store wallet type in localStorage
      localStorage.setItem('selectedWallet', walletType)

      console.log('Connected to wallet:', walletType, 'Account:', account)
    } catch (err) {
      console.error('Error connecting to wallet:', err)
      setError((err as any).message || 'Failed to connect wallet')
      throw err
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      await disconnectWallet(state.walletType)
      localStorage.removeItem('selectedWallet')
      setState({
        account: null,
        provider: null,
        signer: null,
        chainId: null,
        walletType: null
      })
      setError(null)
      console.log('Disconnected from wallet')
    } catch (err) {
      console.error('Error disconnecting wallet:', err)
      setError((err as any).message || 'Failed to disconnect wallet')
    }
  }, [state.walletType])

  // Auto-reconnect on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('selectedWallet') as WalletType | null
    if (savedWallet && !state.account) {
      connect(savedWallet).catch(err => {
        console.error('Auto-reconnect failed:', err)
        localStorage.removeItem('selectedWallet')
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Setup event listeners
  useEffect(() => {
    if (!state.provider) return

    const provider = (state.provider as any).provider

    const cleanup = setupWalletListeners(
      provider,
      async (accounts: string[]) => {
        if (accounts.length === 0) {
          await disconnect()
        } else if (accounts[0] !== state.account) {
          // Account changed
          setState(prev => ({
            ...prev,
            account: accounts[0]
          }))
        }
      },
      async (chainIdHex: string) => {
        // Chain changed - reload the page as recommended by MetaMask
        window.location.reload()
      },
      async () => {
        // Disconnected
        await disconnect()
      }
    )

    return cleanup
  }, [state.provider, state.account, disconnect])

  const value: Web3ContextType = {
    ...state,
    connect,
    disconnect,
    isConnected: !!state.account,
    error,
    isConnecting
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export { Web3Context }
