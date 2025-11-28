import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
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
 * WalletConnect connector for mobile wallets
 */
export class CheeseSwapWalletConnect {
  private wcProvider: WalletConnectProvider | null = null
  private provider: ethers.providers.Web3Provider | null = null

  /**
   * Connect to WalletConnect
   */
  async connect(): Promise<ethers.providers.Web3Provider> {
    try {
      // Create WalletConnect Provider
      this.wcProvider = new WalletConnectProvider({
        rpc: {
          56: NETWORK_URLS[0] || 'https://bsc-dataseed1.binance.org'
        },
        chainId: 56,
        qrcode: true,
        bridge: 'https://bridge.walletconnect.org'
      })

      // Enable session (triggers QR Code modal)
      await this.wcProvider.enable()

      // Create ethers provider
      this.provider = new ethers.providers.Web3Provider(this.wcProvider as any, 'any')

      // Ensure we're on BSC Mainnet
      await ensureBSCMainnet(this.provider)

      return this.provider
    } catch (error) {
      console.error('WalletConnect connection error:', error)
      await this.disconnect()
      throw error
    }
  }

  /**
   * Disconnect WalletConnect
   */
  async disconnect(): Promise<void> {
    if (this.wcProvider) {
      try {
        await this.wcProvider.disconnect()
      } catch (error) {
        console.error('Error disconnecting WalletConnect:', error)
      }
    }

    this.wcProvider = null
    this.provider = null
  }

  /**
   * Get current provider
   */
  getProvider(): ethers.providers.Web3Provider | null {
    return this.provider
  }

  /**
   * Get WalletConnect provider instance
   */
  getWCProvider(): WalletConnectProvider | null {
    return this.wcProvider
  }
}

export const walletConnectConnector = new CheeseSwapWalletConnect()
