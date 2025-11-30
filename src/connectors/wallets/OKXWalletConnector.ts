import { ethers } from 'ethers'
import { BaseWalletConnector } from '../BaseConnector'
import { ensureBSCMainnet } from '../utils'

export class OKXWalletConnector extends BaseWalletConnector {
  constructor() {
    super('OKX Wallet')
  }

  isAvailable(): boolean {
    if (typeof window === 'undefined') return false
    return Boolean((window as any).okxwallet || window.ethereum?.isOKXWallet)
  }

  async connect(): Promise<ethers.providers.Web3Provider> {
    if (!this.isAvailable()) {
      throw new Error('OKX Wallet not detected. Please install OKX Wallet extension.')
    }

    try {
      console.log('[OKXWallet] Connecting...')

      const provider = (window as any).okxwallet || window.ethereum

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from OKX Wallet')
      }

      this.provider = new ethers.providers.Web3Provider(provider, 'any')
      await ensureBSCMainnet(this.provider)

      console.log('[OKXWallet] Successfully connected')
      return this.provider
    } catch (error) {
      console.error('[OKXWallet] Connection error:', error)
      this.provider = null
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null
  }
}

export const okxWalletConnector = new OKXWalletConnector()
