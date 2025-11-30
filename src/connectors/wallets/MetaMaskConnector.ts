import { ethers } from 'ethers'
import { BaseWalletConnector } from '../BaseConnector'
import { ensureBSCMainnet } from '../utils'

export class MetaMaskConnector extends BaseWalletConnector {
  constructor() {
    super('MetaMask')
  }

  isAvailable(): boolean {
    if (typeof window === 'undefined') return false
    
    // MetaMask in-app browser (mobile) and extension
    const isMetaMask = window.ethereum?.isMetaMask
    const isTrust = window.ethereum?.isTrust || window.ethereum?.isTrustWallet
    const isBinance = window.ethereum?.isBinance
    const isOKX = (window.ethereum as any)?.isOKXWallet
    
    // Only return true if it's MetaMask and NOT other wallets
    return Boolean(isMetaMask && !isTrust && !isBinance && !isOKX)
  }

  async connect(): Promise<ethers.providers.Web3Provider> {
    if (!this.isAvailable()) {
      throw new Error('MetaMask not detected. Please install MetaMask extension.')
    }

    try {
      console.log('[MetaMask] Connecting...')

      // MetaMask always uses window.ethereum (both mobile browser and extension)
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from MetaMask')
      }

      console.log('[MetaMask] Accounts received:', accounts)

      this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
      
      console.log('[MetaMask] Checking network...')
      await ensureBSCMainnet(this.provider)

      console.log('[MetaMask] Successfully connected')
      return this.provider
    } catch (error) {
      console.error('[MetaMask] Connection error:', error)
      this.provider = null
      
      // Provide user-friendly error messages
      if ((error as any).code === 4001) {
        throw new Error('Connection request rejected. Please approve the connection in MetaMask.')
      }
      if ((error as any).code === -32002) {
        throw new Error('Connection request already pending. Please check MetaMask.')
      }
      if ((error as any).message?.includes('chain')) {
        throw new Error('Please switch to BSC Mainnet in MetaMask.')
      }
      
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null
  }
}

export const metaMaskConnector = new MetaMaskConnector()
