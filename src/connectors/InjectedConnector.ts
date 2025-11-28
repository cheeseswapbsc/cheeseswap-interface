import { ethers } from 'ethers'
import { getWalletProvider, ensureBSCMainnet, WalletType } from './utils'

/**
 * Connect to injected wallet providers (MetaMask, Trust Wallet, OKX, Fantom)
 */
export class InjectedWalletConnector {
  private provider: ethers.providers.Web3Provider | null = null
  private walletType: WalletType | null = null

  /**
   * Connect to specific injected wallet
   */
  async connect(walletType: WalletType): Promise<ethers.providers.Web3Provider> {
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
   * Get current provider
   */
  getProvider(): ethers.providers.Web3Provider | null {
    return this.provider
  }

  /**
   * Get wallet type
   */
  getWalletType(): WalletType | null {
    return this.walletType
  }
}

export const injectedConnector = new InjectedWalletConnector()
