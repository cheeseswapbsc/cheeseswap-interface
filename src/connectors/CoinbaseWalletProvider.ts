import { ethers } from 'ethers'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { ensureBSCMainnet } from './utils'

const NETWORK_URLS = [
  process.env.REACT_APP_NETWORK_URL_1,
  process.env.REACT_APP_NETWORK_URL_2,
  process.env.REACT_APP_NETWORK_URL_3,
  process.env.REACT_APP_NETWORK_URL_4,
  process.env.REACT_APP_NETWORK_URL_5,
  process.env.REACT_APP_NETWORK_URL_6
].filter(url => typeof url === 'string') as string[]

/**
 * Coinbase Wallet connector
 */
export class CheeseSwapCoinbaseWallet {
  private sdk: CoinbaseWalletSDK | null = null
  private cbProvider: any = null
  private provider: ethers.providers.Web3Provider | null = null

  /**
   * Connect to Coinbase Wallet
   */
  async connect(): Promise<ethers.providers.Web3Provider> {
    try {
      // Initialize Coinbase Wallet SDK
      this.sdk = new CoinbaseWalletSDK({
        appName: 'CheeseSwap',
        appLogoUrl: 'https://cheeseswap.app/images/coins/chs.png',
        darkMode: false
      })

      // Make Web3 Provider
      this.cbProvider = this.sdk.makeWeb3Provider(
        NETWORK_URLS[0] || 'https://bsc-dataseed1.binance.org',
        56
      )

      // Request accounts
      await this.cbProvider.request({
        method: 'eth_requestAccounts'
      })

      // Create ethers provider
      this.provider = new ethers.providers.Web3Provider(this.cbProvider, 'any')

      // Ensure we're on BSC Mainnet
      await ensureBSCMainnet(this.provider)

      return this.provider
    } catch (error) {
      console.error('Coinbase Wallet connection error:', error)
      await this.disconnect()
      throw error
    }
  }

  /**
   * Disconnect Coinbase Wallet
   */
  async disconnect(): Promise<void> {
    if (this.cbProvider && this.cbProvider.close) {
      try {
        await this.cbProvider.close()
      } catch (error) {
        console.error('Error disconnecting Coinbase Wallet:', error)
      }
    }

    this.sdk = null
    this.cbProvider = null
    this.provider = null
  }

  /**
   * Get current provider
   */
  getProvider(): ethers.providers.Web3Provider | null {
    return this.provider
  }

  /**
   * Get Coinbase provider instance
   */
  getCBProvider(): any {
    return this.cbProvider
  }
}

export const coinbaseWalletConnector = new CheeseSwapCoinbaseWallet()
