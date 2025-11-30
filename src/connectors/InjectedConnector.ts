import { ethers } from 'ethers'
import { BaseWalletConnector } from './BaseConnector'
import { getWalletProvider, ensureBSCMainnet, WalletType } from './utils'

/**
 * Generic Injected Connector
 * Works with ANY wallet that injects window.ethereum
 * This is the universal fallback for all wallets not specifically configured
 * CRITICAL: Ensures in-app browsers (Trust Wallet, MetaMask mobile) always work
 */
export class GenericInjectedConnector extends BaseWalletConnector {
  private walletType: WalletType | null = null

  constructor() {
    super('Browser Wallet')
  }

  /**
   * Check if any injected provider is available
   * ALWAYS returns true if window.ethereum exists (safety net)
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && Boolean(window.ethereum)
  }

  /**
   * Connect to any injected wallet provider
   * Works with in-app browsers, extensions, and any wallet with window.ethereum
   */
  async connect(walletType?: WalletType): Promise<ethers.providers.Web3Provider> {
    if (!this.isAvailable()) {
      throw new Error('No injected wallet detected. Please install a Web3 wallet like MetaMask, Trust Wallet, or OKX Wallet.')
    }

    try {
      console.log('[GenericInjected] Attempting to connect to injected provider')

      let injectedProvider: any

      if (walletType) {
        // Try specific wallet if requested
        injectedProvider = getWalletProvider(walletType)
        this.walletType = walletType
        console.log(`[GenericInjected] Trying specific wallet: ${walletType}`)
      } else {
        // Use generic window.ethereum
        // This works for in-app browsers (Trust Wallet, MetaMask mobile)
        injectedProvider = window.ethereum
        this.walletType = null
        console.log('[GenericInjected] Using generic window.ethereum (works with in-app browsers)')
      }

      if (!injectedProvider) {
        throw new Error(`Wallet provider not found${walletType ? ` for ${walletType}` : ''}`)
      }

      console.log('[GenericInjected] Requesting accounts...')

      // Request account access
      // This works the same for desktop extensions and mobile in-app browsers
      const accounts = await injectedProvider.request({
        method: 'eth_requestAccounts'
      })

      console.log('[GenericInjected] Accounts received:', accounts)

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet')
      }

      // Create ethers provider
      this.provider = new ethers.providers.Web3Provider(injectedProvider, 'any')

      console.log('[GenericInjected] Created Web3Provider, ensuring BSC Mainnet')

      // Ensure we're on BSC Mainnet
      await ensureBSCMainnet(this.provider)

      console.log('[GenericInjected] Successfully connected')

      return this.provider
    } catch (error) {
      console.error('[GenericInjected] Error connecting:', error)
      this.provider = null
      this.walletType = null
      throw error
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    this.provider = null
    this.walletType = null
  }

  /**
   * Get wallet type if known
   */
  getWalletType(): WalletType | null {
    return this.walletType
  }
}

/**
 * Injected wallet connector for specific wallet types
 */
export class InjectedWalletConnector extends BaseWalletConnector {
  private walletType: WalletType | null = null

  constructor(name: string = 'Injected Wallet') {
    super(name)
  }

  /**
   * Check if specific injected provider is available
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && Boolean(window.ethereum)
  }

  /**
   * Connect to specific injected wallet
   * Note: walletType should be passed when calling this method
   */
  async connect(walletType: WalletType = 'METAMASK'): Promise<ethers.providers.Web3Provider> {
    if (walletType === 'WALLETCONNECT' || walletType === 'COINBASE') {
      throw new Error('Use WalletConnect or Coinbase connector instead')
    }

    console.log(`[InjectedConnector] Attempting to connect to ${walletType}`)

    const injectedProvider = getWalletProvider(walletType)

    console.log(`[InjectedConnector] Provider for ${walletType}:`, injectedProvider)

    if (!injectedProvider) {
      const errorMsg = `${walletType} wallet is not installed. Please install the ${walletType} extension.`
      console.error(`[InjectedConnector] ${errorMsg}`)
      throw new Error(errorMsg)
    }

    try {
      console.log(`[InjectedConnector] Requesting accounts from ${walletType}`)

      // Request account access
      const accounts = await injectedProvider.request({
        method: 'eth_requestAccounts'
      })

      console.log(`[InjectedConnector] Accounts received:`, accounts)

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet')
      }

      // Create ethers provider
      this.provider = new ethers.providers.Web3Provider(injectedProvider, 'any')
      this.walletType = walletType

      console.log(`[InjectedConnector] Created Web3Provider, ensuring BSC Mainnet`)

      // Ensure we're on BSC Mainnet
      await ensureBSCMainnet(this.provider)

      console.log(`[InjectedConnector] Successfully connected to ${walletType}`)

      return this.provider
    } catch (error) {
      console.error(`[InjectedConnector] Error connecting to ${walletType}:`, error)
      this.provider = null
      this.walletType = null
      throw error
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    this.provider = null
    this.walletType = null
  }

  /**
   * Get wallet type
   */
  getWalletType(): WalletType | null {
    return this.walletType
  }
}

// Singleton instances
export const injectedConnector = new GenericInjectedConnector()
export const specificInjectedConnector = new InjectedWalletConnector()
