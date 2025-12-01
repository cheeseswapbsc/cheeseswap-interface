import { ethers } from 'ethers'
import { metaMaskConnector } from './wallets/MetaMaskConnector'
import { binanceWalletConnector } from './wallets/BinanceWalletConnector'
import { trustWalletConnector } from './wallets/TrustWalletConnector'
import { okxWalletConnector } from './wallets/OKXWalletConnector'
import { fantomWalletConnector } from './wallets/FantomWalletConnector'
import { injectedConnector } from './wallets/InjectedConnector'
import { walletConnectConnector } from './WalletConnectProvider'
import { coinbaseWalletConnector } from './CoinbaseWalletProvider'
import { IWalletConnector } from './BaseConnector'
import { WalletNotAvailableError } from './errors'

export type ConnectorId = 
  | 'injected'  // Generic fallback for any window.ethereum wallet
  | 'metamask'
  | 'binance'
  | 'trustwallet'
  | 'okxwallet'
  | 'fantomwallet'
  | 'walletconnect'
  | 'coinbasewallet'

/**
 * Connector Factory
 * Manages wallet connectors with smart fallback logic
 */
export class ConnectorFactory {
  private static connectorMap: Record<ConnectorId, IWalletConnector> = {
    metamask: metaMaskConnector,
    binance: binanceWalletConnector,
    trustwallet: trustWalletConnector,
    okxwallet: okxWalletConnector,
    fantomwallet: fantomWalletConnector,
    injected: injectedConnector,  // Generic injected connector - the safety net
    walletconnect: walletConnectConnector,
    coinbasewallet: coinbaseWalletConnector,
  }

  /**
   * Get connector by ID
   */
  static getConnector(connectorId: ConnectorId): IWalletConnector {
    const connector = this.connectorMap[connectorId]
    if (!connector) {
      throw new Error(`Unknown connector: ${connectorId}`)
    }
    return connector
  }

  /**
   * Connect with smart fallback logic
   * STRATEGY: Always try injected first if window.ethereum exists
   * This maintains backward compatibility with in-app browsers
   */
  static async connect(connectorId: ConnectorId): Promise<ethers.providers.Web3Provider> {
    console.log(`[ConnectorFactory] Connection requested for: ${connectorId}`)

    // Get the appropriate connector
    const connector = this.getConnector(connectorId)
    
    // Check if connector is available
    if (!connector.isAvailable()) {
      throw new WalletNotAvailableError(connectorId)
    }

    // Attempt connection - let errors propagate to UI for refresh button handling
    console.log(`[ConnectorFactory] Connecting with ${connectorId}`)
    return await connector.connect()
  }

  /**
   * Auto-detect and connect to best available wallet
   * Priority: Specific wallets → Generic injected → WalletConnect
   */
  static async autoConnect(): Promise<{
    provider: ethers.providers.Web3Provider
    connectorId: ConnectorId
  }> {
    // Priority order (INJECTED > METAMASK > BINANCE > TRUST > OKX > FANTOM > WALLETCONNECT > COINBASEWALLET)
    const priorityOrder: ConnectorId[] = [
      'injected',
      'metamask',
      'binance',
      'trustwallet',
      'okxwallet',
      'fantomwallet',
      'coinbasewallet',
    ];

    for (const id of priorityOrder) {
      const connector = this.getConnector(id);
      if (connector.isAvailable()) {
        try {
          console.log(`[AutoConnect] Trying ${id}...`);
          const provider = await connector.connect();
          return { provider, connectorId: id };
        } catch (error) {
          console.error(`[AutoConnect] ${id} failed:`, error);
          continue;
        }
      }
    }
    // Fallback to WalletConnect if all else fails
    const walletConnect = this.getConnector('walletconnect');
    if (walletConnect.isAvailable()) {
      try {
        console.log('[AutoConnect] Fallback to WalletConnect...');
        const provider = await walletConnect.connect();
        return { provider, connectorId: 'walletconnect' };
      } catch (error) {
        console.error('[AutoConnect] WalletConnect failed:', error);
      }
    }
    throw new Error('No wallet connector available');
  }

  /**
   * Disconnect current connector
   */
  static async disconnect(connectorId: ConnectorId): Promise<void> {
    const connector = this.getConnector(connectorId)
    await connector.disconnect()
  }

  /**
   * Get all available connectors
   */
  static getAvailableConnectors(): Array<{
    id: ConnectorId
    name: string
    available: boolean
  }> {
    return Object.entries(this.connectorMap).map(([id, connector]) => ({
      id: id as ConnectorId,
      name: connector.getName(),
      available: connector.isAvailable(),
    }))
  }

  /**
   * Check if connector ID is an injected wallet type
   */
  private static isInjectedWallet(connectorId: ConnectorId): boolean {
    return [
      'injected',
      'metamask',
      'binance',
      'trustwallet',
      'okxwallet',
      'fantomwallet',
      'coinbasewallet'
    ].includes(connectorId)
  }

  /**
   * Get recommended connector for mobile
   */
  static getRecommendedMobileConnector(): ConnectorId {
    // Check if any specific wallet is available on mobile
    const mobileOrder: ConnectorId[] = [
      'injected',
      'metamask',
      'binance',
      'trustwallet',
      'okxwallet',
      'fantomwallet',
      'walletconnect',
      'coinbasewallet',
    ]
    for (const id of mobileOrder) {
      const connector = this.getConnector(id)
      if (connector.isAvailable()) {
        return id
      }
    }
    // If no wallet found, throw error
    throw new Error('No wallet connector available for mobile')
  }

  /**
   * Detect if running on mobile
   */
  static isMobile(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }
}
