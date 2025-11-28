import { ethers } from 'ethers'
import { injectedConnector } from './InjectedConnector'
import { walletConnectConnector } from './WalletConnectProvider'
import { coinbaseWalletConnector } from './CoinbaseWalletProvider'
import { WalletType } from './utils'

export const CHAIN_ID = 56 as const
export const CHAIN_ID_HEX = '0x38' as const
export const NETWORK_NAME = 'BSC Mainnet'

const NETWORK_URLS = [
  process.env.REACT_APP_NETWORK_URL_1,
  process.env.REACT_APP_NETWORK_URL_2,
  process.env.REACT_APP_NETWORK_URL_3,
  process.env.REACT_APP_NETWORK_URL_4,
  process.env.REACT_APP_NETWORK_URL_5,
  process.env.REACT_APP_NETWORK_URL_6
].filter(url => typeof url === 'string') as string[]

if (NETWORK_URLS.length === 0) {
  throw new Error('At least one RPC URL must be defined in environment variables')
}

/**
 * Create a read-only JSON-RPC provider for network calls
 */
export function getNetworkProvider(): ethers.providers.JsonRpcProvider {
  // Use first RPC URL for read-only operations
  return new ethers.providers.JsonRpcProvider(NETWORK_URLS[0], {
    name: NETWORK_NAME,
    chainId: CHAIN_ID
  })
}

/**
 * Get fallback provider with multiple RPCs for redundancy
 */
export function getFallbackProvider(): ethers.providers.FallbackProvider {
  const providers = NETWORK_URLS.map((url, index) => ({
    provider: new ethers.providers.JsonRpcProvider(url, {
      name: NETWORK_NAME,
      chainId: CHAIN_ID
    }),
    priority: index,
    stallTimeout: 2000,
    weight: 1
  }))

  return new ethers.providers.FallbackProvider(providers)
}

/**
 * Connect to wallet based on wallet type
 */
export async function connectWallet(walletType: WalletType): Promise<ethers.providers.Web3Provider> {
  switch (walletType) {
    case 'METAMASK':
    case 'TRUST_WALLET':
    case 'OKX_WALLET':
    case 'FANTOM_WALLET':
      return await injectedConnector.connect(walletType)

    case 'WALLETCONNECT':
      return await walletConnectConnector.connect()

    case 'COINBASE':
      return await coinbaseWalletConnector.connect()

    default:
      throw new Error(`Unsupported wallet type: ${walletType}`)
  }
}

/**
 * Disconnect from wallet
 */
export async function disconnectWallet(walletType: WalletType | null): Promise<void> {
  if (!walletType) return

  switch (walletType) {
    case 'METAMASK':
    case 'TRUST_WALLET':
    case 'OKX_WALLET':
    case 'FANTOM_WALLET':
      await injectedConnector.disconnect()
      break

    case 'WALLETCONNECT':
      await walletConnectConnector.disconnect()
      break

    case 'COINBASE':
      await coinbaseWalletConnector.disconnect()
      break
  }
}

// Export connectors
export { injectedConnector, walletConnectConnector, coinbaseWalletConnector }

// Export utilities
export * from './utils'

// Network provider singleton
let networkProvider: ethers.providers.JsonRpcProvider | null = null

export function getNetworkLibrary(): ethers.providers.JsonRpcProvider {
  if (!networkProvider) {
    networkProvider = getNetworkProvider()
  }
  return networkProvider
}
