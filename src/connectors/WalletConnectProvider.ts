import { ethers } from 'ethers'
import type EthereumProviderType from '@walletconnect/ethereum-provider'
import { BaseWalletConnector } from './BaseConnector'
import { UserRejectedError } from './errors'

const BSC_CHAIN_ID = 56
const BSC_RPC_URL = import.meta.env.REACT_APP_NETWORK_URL_1 || 'https://bsc-dataseed1.bnbchain.org'
const PROJECT_ID = import.meta.env.REACT_APP_WALLETCONNECT_PROJECT_ID || ''

/**
 * WalletConnect v2 connector
 * Replaces the deprecated v1 bridge (shut down in 2023) with the
 * WalletConnect v2 relay network + built-in QR modal.
 */
export class CheeseSwapWalletConnect extends BaseWalletConnector {
  private wcProvider: EthereumProviderType | null = null
  private initPromise: Promise<EthereumProviderType> | null = null
  private displayUriListeners = new Set<(uri: string) => void>()

  constructor() {
    super('WalletConnect')
  }

  /**
   * Subscribe to the WalletConnect pairing URI (for rendering a QR code).
   * Returns an unsubscribe function.
   */
  onDisplayUri(listener: (uri: string) => void): () => void {
    this.displayUriListeners.add(listener)
    return () => this.displayUriListeners.delete(listener)
  }

  isAvailable(): boolean {
    return Boolean(PROJECT_ID)
  }

  /**
   * Lazily initialize the v2 provider (restores persisted sessions).
   */
  private async getWcProvider(): Promise<EthereumProviderType> {
    if (this.wcProvider) return this.wcProvider
    if (!this.initPromise) {
      this.initPromise = (async () => {
        if (!PROJECT_ID) {
          throw new Error(
            'WalletConnect is not configured: set REACT_APP_WALLETCONNECT_PROJECT_ID in your environment.'
          )
        }
        const { EthereumProvider } = await import('@walletconnect/ethereum-provider')
        const provider = await EthereumProvider.init({
          projectId: PROJECT_ID,
          chains: [BSC_CHAIN_ID],
          optionalChains: [BSC_CHAIN_ID],
          rpcMap: { [BSC_CHAIN_ID]: BSC_RPC_URL },
          showQrModal: true,
          metadata: {
            name: 'CheeseSwap',
            description: 'CheeseSwap Interface - swap and provide liquidity on BNB Smart Chain',
            url: window.location.origin,
            icons: ['https://cheeseswap.app/images/coins/chs.png']
          }
        })
        this.wcProvider = provider
        provider.on('display_uri', (uri: string) => {
          this.displayUriListeners.forEach(listener => listener(uri))
        })
        this.setupWalletConnectListeners()
        return provider
      })()
      this.initPromise.catch(() => {
        this.initPromise = null
      })
    }
    return this.initPromise
  }

  async connect(): Promise<ethers.providers.Web3Provider> {
    try {
      console.log('[WalletConnect] Initializing WalletConnect v2...')
      const wcProvider = await this.getWcProvider()

      // Opens the QR modal unless a session is already restored
      if (!wcProvider.session) {
        await wcProvider.connect()
      } else {
        await wcProvider.enable()
      }

      this.provider = new ethers.providers.Web3Provider(wcProvider as any, 'any')
      console.log('[WalletConnect] Successfully connected')
      return this.provider
    } catch (error) {
      console.error('[WalletConnect] Connection error:', error)
      this.provider = null
      const message = (error as any)?.message || ''
      if ((error as any)?.code === 4001 || /rejected|declined|cancelled|canceled/i.test(message)) {
        throw new UserRejectedError('WalletConnect')
      }
      throw error
    }
  }

  /**
   * Silent reconnect: restores a persisted v2 session without showing the modal.
   */
  async eagerConnect(): Promise<ethers.providers.Web3Provider | null> {
    if (!this.isAvailable()) return null
    try {
      const wcProvider = await this.getWcProvider()
      if (!wcProvider.session || !wcProvider.accounts || wcProvider.accounts.length === 0) {
        return null
      }
      this.provider = new ethers.providers.Web3Provider(wcProvider as any, 'any')
      console.log('[WalletConnect] Session restored')
      return this.provider
    } catch (error) {
      console.warn('[WalletConnect] Eager connect failed:', error)
      return null
    }
  }

  async disconnect(): Promise<void> {
    if (this.wcProvider) {
      try {
        await this.wcProvider.disconnect()
      } catch (error) {
        console.error('[WalletConnect] Error disconnecting:', error)
      }
    }
    this.provider = null
  }

  getWcEip1193Provider(): any {
    return this.wcProvider
  }

  private setupWalletConnectListeners(): void {
    if (!this.wcProvider) return

    this.wcProvider.on('accountsChanged', (accounts: string[]) => {
      console.log('[WalletConnect] Accounts changed:', accounts)
      if (accounts.length === 0) {
        this.disconnect()
      }
    })

    this.wcProvider.on('chainChanged', (chainId: string) => {
      console.log('[WalletConnect] Chain changed:', chainId)
    })

    this.wcProvider.on('disconnect', () => {
      console.log('[WalletConnect] Session disconnected')
      this.provider = null
    })
  }
}

export const walletConnectConnector = new CheeseSwapWalletConnect()
