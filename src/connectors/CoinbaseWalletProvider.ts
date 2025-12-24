import { ethers } from 'ethers'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { BaseWalletConnector } from './BaseConnector'
import { ensureBSCMainnet } from './utils'

const NETWORK_URL_KEYS = [
  'REACT_APP_NETWORK_URL_1',
  'REACT_APP_NETWORK_URL_2',
  'REACT_APP_NETWORK_URL_3',
  'REACT_APP_NETWORK_URL_4',
  'REACT_APP_NETWORK_URL_5',
  'REACT_APP_NETWORK_URL_6',
  'REACT_APP_NETWORK_URL_7',
  'REACT_APP_NETWORK_URL_8',
  'REACT_APP_NETWORK_URL_9',
  'REACT_APP_NETWORK_URL_10',
  'REACT_APP_NETWORK_URL_11',
  'REACT_APP_NETWORK_URL_12',
  'REACT_APP_NETWORK_URL_13'
] as const

const NETWORK_URLS = NETWORK_URL_KEYS.map(key => process.env[key]).filter((url): url is string => typeof url === 'string')

/**
 * Coinbase Wallet connector
 */
export class CheeseSwapCoinbaseWallet extends BaseWalletConnector {
  private sdk: CoinbaseWalletSDK | null = null
  private cbProvider: any = null

  constructor() {
    super('Coinbase Wallet')
  }

  /**
   * Coinbase Wallet is always available (via SDK)
   */
  isAvailable(): boolean {
    return true
  }

  /**
   * Connect to Coinbase Wallet
   */
  async connect(): Promise<ethers.providers.Web3Provider> {
    try {
      console.log('[CoinbaseWallet] Initializing Coinbase Wallet SDK...')

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

      console.log('[CoinbaseWallet] Requesting accounts...')

      // Request accounts
      await this.cbProvider.request({
        method: 'eth_requestAccounts'
      })

      // Create ethers provider
      this.provider = new ethers.providers.Web3Provider(this.cbProvider, 'any')

      // Ensure we're on BSC Mainnet
      await ensureBSCMainnet(this.provider)

      console.log('[CoinbaseWallet] Successfully connected')

      return this.provider
    } catch (error) {
      console.error('[CoinbaseWallet] Connection error:', error)
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
        console.error('[CoinbaseWallet] Error disconnecting:', error)
      }
    }

    this.sdk = null
    this.cbProvider = null
    this.provider = null
  }

  /**
   * Get Coinbase provider instance
   */
  getCBProvider(): any {
    return this.cbProvider
  }
}

export const coinbaseWalletConnector = new CheeseSwapCoinbaseWallet()
