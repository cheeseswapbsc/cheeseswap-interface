import { ethers } from 'ethers'
import { ConnectorFactory, ConnectorId } from './ConnectorFactory'
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
].filter(url => typeof url === 'string') as string[];

if (NETWORK_URLS.length === 0) {
  throw new Error('At least one RPC URL must be defined in environment variables');
}

/**
 * Modern fallback provider using ethers.js FallbackProvider for round-robin/fallback
 */
export function getNetworkProvider(): ethers.providers.FallbackProvider {
  const providers = NETWORK_URLS.map((url, index) => ({
    provider: new ethers.providers.JsonRpcProvider(url, {
      name: NETWORK_NAME,
      chainId: CHAIN_ID
    }),
    priority: index,
    stallTimeout: 500,
    weight: 1
  }));
  return new ethers.providers.FallbackProvider(providers);
}

/**
 * Connect to wallet using ConnectorFactory
 * Supports both old WalletType (backward compatible) and new ConnectorId
 */
export async function connectWallet(
  walletTypeOrConnectorId: WalletType | ConnectorId
): Promise<ethers.providers.Web3Provider> {
  // Convert WalletType to ConnectorId if needed
  let connectorId: ConnectorId
  
  // Check if it's a WalletType (uppercase) or ConnectorId (lowercase)
  if (walletTypeOrConnectorId === walletTypeOrConnectorId.toUpperCase()) {
    // It's a WalletType, convert it
    connectorId = walletTypeToConnectorId(walletTypeOrConnectorId as WalletType)
  } else {
    // It's already a ConnectorId
    connectorId = walletTypeOrConnectorId as ConnectorId
  }
  
  return await ConnectorFactory.connect(connectorId)
}

/**
 * Auto-detect and connect to best available wallet
 */
export async function autoConnectWallet(): Promise<{
  provider: ethers.providers.Web3Provider
  connectorId: ConnectorId
}> {
  return await ConnectorFactory.autoConnect()
}

/**
 * Disconnect from wallet
 * Supports both old WalletType (backward compatible) and new ConnectorId
 */
export async function disconnectWallet(walletTypeOrConnectorId?: WalletType | ConnectorId | null): Promise<void> {
  if (!walletTypeOrConnectorId) {
    return // Nothing to disconnect
  }
  
  // Convert WalletType to ConnectorId if needed
  let connectorId: ConnectorId
  
  // Check if it's a WalletType (uppercase) or ConnectorId (lowercase)
  if (walletTypeOrConnectorId === walletTypeOrConnectorId.toUpperCase()) {
    // It's a WalletType, convert it
    connectorId = walletTypeToConnectorId(walletTypeOrConnectorId as WalletType)
  } else {
    // It's already a ConnectorId
    connectorId = walletTypeOrConnectorId as ConnectorId
  }
  
  await ConnectorFactory.disconnect(connectorId)
}

/**
 * Get all available wallet connectors
 */
export function getAvailableWallets() {
  return ConnectorFactory.getAvailableConnectors()
}

// Export ConnectorFactory and types
export { ConnectorFactory }
export type { ConnectorId }

// Export utilities
export * from './utils'

// Network provider singleton
let networkProvider: ethers.providers.JsonRpcProvider | null = null

export function getNetworkLibrary(): ethers.providers.JsonRpcProvider {
  if (!networkProvider) {
    networkProvider = getNetworkProvider() as any // FallbackProvider, cast for compatibility
  }
  return networkProvider
}

// Export error types
export * from './errors'

// Legacy support - map old WalletType to new ConnectorId
export function walletTypeToConnectorId(walletType: WalletType): ConnectorId {
  switch (walletType) {
    case 'INJECTED':
      return 'injected'
    default:
      return 'injected'
    case 'METAMASK':
      return 'metamask'
    case 'TRUST_WALLET':
      return 'trustwallet'
    case 'OKX_WALLET':
      return 'okxwallet'
    case 'FANTOM_WALLET':
      return 'fantomwallet'
    case 'WALLETCONNECT':
      return 'walletconnect'
    case 'COINBASE':
      return 'coinbasewallet'
      }
}
