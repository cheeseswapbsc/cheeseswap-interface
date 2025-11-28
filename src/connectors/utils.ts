import { ethers } from 'ethers'

export type WalletType = 'METAMASK' | 'TRUST_WALLET' | 'OKX_WALLET' | 'FANTOM_WALLET' | 'WALLETCONNECT' | 'COINBASE'

export interface DetectedWallet {
  type: WalletType
  name: string
  installed: boolean
}

/**
 * Detect installed wallets in browser
 */
export function detectInstalledWallets(): DetectedWallet[] {
  const wallets: DetectedWallet[] = []

  // MetaMask - check it's MetaMask and not other wallets
  wallets.push({
    type: 'METAMASK',
    name: 'MetaMask',
    installed: !!(
      window.ethereum?.isMetaMask && 
      !window.ethereum?.isTrust && 
      !window.ethereum?.isFTM &&
      !(window.ethereum as any)?.isTokenPocket
    )
  })

  // Trust Wallet - check for isTrust flag or trustwallet object
  wallets.push({
    type: 'TRUST_WALLET',
    name: 'Trust Wallet',
    installed: !!(window.ethereum?.isTrust || (window as any).trustwallet)
  })

  // OKX Wallet - check for okxwallet object
  wallets.push({
    type: 'OKX_WALLET',
    name: 'OKX Wallet',
    installed: !!(window.okxwallet || (window as any).okxwallet)
  })

  // Fantom Wallet - check for ftmwallet or isFTM
  wallets.push({
    type: 'FANTOM_WALLET',
    name: 'Fantom Wallet',
    installed: !!((window as any).ftmwallet || window.ethereum?.isFTM)
  })

  // WalletConnect (always available)
  wallets.push({
    type: 'WALLETCONNECT',
    name: 'WalletConnect',
    installed: true
  })

  // Coinbase Wallet (always available via SDK)
  wallets.push({
    type: 'COINBASE',
    name: 'Coinbase Wallet',
    installed: true
  })

  return wallets
}

/**
 * Get wallet provider from window object
 */
export function getWalletProvider(walletType: WalletType): any {
  console.log(`[getWalletProvider] Looking for ${walletType}`)
  console.log('[getWalletProvider] window.ethereum:', window.ethereum)
  console.log('[getWalletProvider] window.okxwallet:', window.okxwallet)
  
  switch (walletType) {
    case 'METAMASK':
      // Return MetaMask if it's detected and not other wallets
      if (
        window.ethereum?.isMetaMask && 
        !window.ethereum?.isTrust && 
        !window.ethereum?.isFTM &&
        !(window.ethereum as any)?.isTokenPocket
      ) {
        console.log('[getWalletProvider] Found MetaMask')
        return window.ethereum
      }
      console.log('[getWalletProvider] MetaMask not found')
      return null

    case 'TRUST_WALLET':
      // Trust Wallet - prefer window.ethereum.isTrust
      if (window.ethereum?.isTrust) {
        console.log('[getWalletProvider] Found Trust Wallet via window.ethereum.isTrust')
        return window.ethereum
      }
      // Fallback to window.trustwallet if exists
      if ((window as any).trustwallet) {
        console.log('[getWalletProvider] Found Trust Wallet via window.trustwallet')
        return (window as any).trustwallet
      }
      // Fallback to window.ethereum if available (compatible mode)
      if (window.ethereum) {
        console.log('[getWalletProvider] Trust Wallet not detected, falling back to window.ethereum')
        return window.ethereum
      }
      console.log('[getWalletProvider] Trust Wallet not found')
      return null

    case 'OKX_WALLET':
      // OKX Wallet - window.okxwallet is the primary provider
      const okxProvider = window.okxwallet || (window as any).okxwallet
      if (okxProvider) {
        console.log('[getWalletProvider] Found OKX Wallet')
        return okxProvider
      }
      // Fallback to window.ethereum if available (compatible mode)
      if (window.ethereum) {
        console.log('[getWalletProvider] OKX Wallet not detected, falling back to window.ethereum')
        return window.ethereum
      }
      console.log('[getWalletProvider] OKX Wallet not found')
      return null

    case 'FANTOM_WALLET':
      // Fantom wallet detection - check multiple possibilities
      console.log('[getWalletProvider] Checking for Fantom Wallet')
      console.log('[getWalletProvider] window.ethereum?.isFTM:', window.ethereum?.isFTM)
      console.log('[getWalletProvider] (window as any).ftmwallet:', (window as any).ftmwallet)
      
      // Check if Fantom uses window.ethereum like other injected wallets
      if (window.ethereum?.isFTM) {
        console.log('[getWalletProvider] Found Fantom Wallet via window.ethereum.isFTM')
        return window.ethereum
      }
      
      // Check for dedicated ftmwallet object
      if ((window as any).ftmwallet) {
        console.log('[getWalletProvider] Found Fantom Wallet via window.ftmwallet')
        return (window as any).ftmwallet
      }
      
      // Fallback to window.ethereum if available (compatible mode)
      if (window.ethereum) {
        console.log('[getWalletProvider] Fantom Wallet not detected, falling back to window.ethereum (MetaMask-compatible mode)')
        return window.ethereum
      }
      
      console.log('[getWalletProvider] Fantom Wallet not found')
      return null

    default:
      return null
  }
}

/**
 * Check if a specific wallet is installed
 */
export function isWalletInstalled(walletType: WalletType): boolean {
  // WalletConnect and Coinbase are always available (via SDK)
  if (walletType === 'WALLETCONNECT' || walletType === 'COINBASE') {
    return true
  }
  
  // For injected wallets, check if provider exists
  const provider = getWalletProvider(walletType)
  return provider !== null
}

/**
 * Request accounts from wallet
 */
export async function requestAccounts(provider: any): Promise<string[]> {
  try {
    const accounts = await provider.request({
      method: 'eth_requestAccounts'
    })
    return accounts
  } catch (error) {
    console.error('Error requesting accounts:', error)
    throw error
  }
}

/**
 * Switch to BSC Mainnet
 */
export async function switchToBSCMainnet(provider: ethers.providers.Web3Provider): Promise<void> {
  const CHAIN_ID_HEX = '0x38' // 56 in hex
  
  try {
    await provider.send('wallet_switchEthereumChain', [
      { chainId: CHAIN_ID_HEX }
    ])
  } catch (switchError) {
    // This error code indicates that the chain has not been added to the wallet
    if ((switchError as any).code === 4902) {
      await addBSCMainnet(provider)
    } else {
      throw switchError
    }
  }
}

/**
 * Add BSC Mainnet to wallet
 */
export async function addBSCMainnet(provider: ethers.providers.Web3Provider): Promise<void> {
  await provider.send('wallet_addEthereumChain', [
    {
      chainId: '0x38',
      chainName: 'BNB Smart Chain Mainnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
      },
      rpcUrls: [
        'https://bsc-dataseed1.binance.org',
        'https://bsc-dataseed2.binance.org',
        'https://bsc-dataseed3.binance.org',
        'https://bsc-dataseed4.binance.org'
      ],
      blockExplorerUrls: ['https://bscscan.com']
    }
  ])
}

/**
 * Ensure user is on BSC Mainnet
 */
export async function ensureBSCMainnet(provider: ethers.providers.Web3Provider): Promise<void> {
  const network = await provider.getNetwork()
  
  if (network.chainId !== 56) {
    await switchToBSCMainnet(provider)
  }
}

/**
 * Setup event listeners for wallet
 */
export function setupWalletListeners(
  provider: any,
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void,
  onDisconnect: () => void
): () => void {
  if (!provider || !provider.on) {
    return () => {}
  }

  const handleAccountsChanged = (accounts: string[]) => {
    onAccountsChanged(accounts)
  }

  const handleChainChanged = (chainId: string) => {
    onChainChanged(chainId)
  }

  const handleDisconnect = () => {
    onDisconnect()
  }

  provider.on('accountsChanged', handleAccountsChanged)
  provider.on('chainChanged', handleChainChanged)
  provider.on('disconnect', handleDisconnect)

  // Return cleanup function
  return () => {
    if (provider.removeListener) {
      provider.removeListener('accountsChanged', handleAccountsChanged)
      provider.removeListener('chainChanged', handleChainChanged)
      provider.removeListener('disconnect', handleDisconnect)
    }
  }
}
