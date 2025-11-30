import { ethers } from 'ethers'
import { BaseWalletConnector } from '../BaseConnector'
import { ensureBSCMainnet } from '../utils'

export class TrustWalletConnector extends BaseWalletConnector {
  constructor() {
    super('Trust Wallet')
  }

  isAvailable(): boolean {
    if (typeof window === 'undefined') return false
    
    // Trust Wallet in-app browser (mobile)
    if (window.ethereum?.isTrust) return true
    if (window.ethereum?.isTrustWallet) return true
    
    // Trust Wallet standalone object
    if ((window as any).trustwallet) return true
    
    return false
  }

  async connect(): Promise<ethers.providers.Web3Provider> {
    if (!this.isAvailable()) {
      throw new Error('Trust Wallet not detected. Please install Trust Wallet or use Trust Wallet browser.')
    }

    try {
      console.log('[TrustWallet] Connecting...')

      // Try to get the correct provider
      let provider: any
      
      // Trust Wallet in-app browser uses window.ethereum
      if (window.ethereum?.isTrust || window.ethereum?.isTrustWallet) {
        provider = window.ethereum
        console.log('[TrustWallet] Using in-app browser provider')
      } 
      // Trust Wallet extension uses trustwallet object
      else if ((window as any).trustwallet) {
        provider = (window as any).trustwallet
        console.log('[TrustWallet] Using extension provider')
      }
      else {
        throw new Error('Trust Wallet provider not found')
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from Trust Wallet')
      }

      this.provider = new ethers.providers.Web3Provider(provider, 'any')
      await ensureBSCMainnet(this.provider)

      console.log('[TrustWallet] Successfully connected')
      return this.provider
    } catch (error) {
      console.error('[TrustWallet] Connection error:', error)
      this.provider = null
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null
  }
}

export const trustWalletConnector = new TrustWalletConnector()
