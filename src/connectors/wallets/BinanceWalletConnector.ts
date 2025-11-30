import { ethers } from 'ethers'
import { BaseWalletConnector } from '../BaseConnector'
import { ensureBSCMainnet } from '../utils'

export class BinanceWalletConnector extends BaseWalletConnector {
  constructor() {
    super('Binance Wallet')
  }

  isAvailable(): boolean {
    if (typeof window === 'undefined') return false
    return Boolean(window.ethereum?.isBinance || (window as any).BinanceChain)
  }

  async connect(): Promise<ethers.providers.Web3Provider> {
    if (!this.isAvailable()) {
      throw new Error('Binance Wallet not detected. Please install Binance Wallet extension.')
    }

    try {
      console.log('[BinanceWallet] Connecting...')

      const provider = window.ethereum?.isBinance ? window.ethereum : (window as any).BinanceChain

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from Binance Wallet')
      }

      this.provider = new ethers.providers.Web3Provider(provider, 'any')
      await ensureBSCMainnet(this.provider)

      console.log('[BinanceWallet] Successfully connected')
      return this.provider
    } catch (error) {
      console.error('[BinanceWallet] Connection error:', error)
      this.provider = null
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null
  }
}

export const binanceWalletConnector = new BinanceWalletConnector()
