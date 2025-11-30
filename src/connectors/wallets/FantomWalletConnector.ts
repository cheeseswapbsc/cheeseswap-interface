import { ethers } from 'ethers'
import { BaseWalletConnector } from '../BaseConnector'
import { ensureBSCMainnet } from '../utils'

export class FantomWalletConnector extends BaseWalletConnector {
  constructor() {
    super('Fantom Wallet')
  }

  isAvailable(): boolean {
    if (typeof window === 'undefined') return false
    return Boolean((window as any).ftmwallet || window.ethereum?.isFTM)
  }

  async connect(): Promise<ethers.providers.Web3Provider> {
    if (!this.isAvailable()) {
      throw new Error('Fantom Wallet not detected. Please install Fantom Wallet extension.')
    }

    try {
      console.log('[FantomWallet] Connecting...')

      const provider = (window as any).ftmwallet || window.ethereum

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from Fantom Wallet')
      }

      this.provider = new ethers.providers.Web3Provider(provider, 'any')
      await ensureBSCMainnet(this.provider)

      console.log('[FantomWallet] Successfully connected')
      return this.provider
    } catch (error) {
      console.error('[FantomWallet] Connection error:', error)
      this.provider = null
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null
  }
}

export const fantomWalletConnector = new FantomWalletConnector()
