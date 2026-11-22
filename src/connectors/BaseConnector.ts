import { ethers } from 'ethers'

/**
 * Interface for all wallet connectors
 */
export interface IWalletConnector {
  /**
   * Connect to the wallet
   */
  connect(): Promise<ethers.BrowserProvider>

  /**
   * Disconnect from the wallet
   */
  disconnect(): Promise<void>

  /**
   * Check if the wallet is available/installed
   */
  isAvailable(): boolean

  /**
   * Get the current provider instance
   */
  getProvider(): ethers.BrowserProvider | null

  /**
   * Get the underlying EIP-1193 provider (BrowserProvider keeps it private in v6)
   */
  getEip1193Provider(): any

  /**
   * Get the name of the wallet
   */
  getName(): string
}

/**
 * Base class for all wallet connectors
 */
export abstract class BaseWalletConnector implements IWalletConnector {
  protected provider: ethers.BrowserProvider | null = null
  protected eip1193: any = null
  protected walletName: string

  constructor(walletName: string) {
    this.walletName = walletName
  }

  abstract connect(): Promise<ethers.BrowserProvider>
  abstract disconnect(): Promise<void>
  abstract isAvailable(): boolean

  getProvider(): ethers.BrowserProvider | null {
    return this.provider
  }

  getEip1193Provider(): any {
    return this.eip1193
  }

  getName(): string {
    return this.walletName
  }

  /**
   * Setup event listeners for the provider
   */
  protected setupListeners(
    injectedProvider: any,
    onAccountsChanged?: (accounts: string[]) => void,
    onChainChanged?: (chainId: string) => void,
    onDisconnect?: () => void
  ): void {
    if (!injectedProvider || !injectedProvider.on) {
      return
    }

    if (onAccountsChanged) {
      injectedProvider.on('accountsChanged', onAccountsChanged)
    }

    if (onChainChanged) {
      injectedProvider.on('chainChanged', onChainChanged)
    }

    if (onDisconnect) {
      injectedProvider.on('disconnect', onDisconnect)
    }
  }

  /**
   * Remove event listeners
   */
  protected removeListeners(injectedProvider: any): void {
    if (!injectedProvider || !injectedProvider.removeAllListeners) {
      return
    }

    injectedProvider.removeAllListeners('accountsChanged')
    injectedProvider.removeAllListeners('chainChanged')
    injectedProvider.removeAllListeners('disconnect')
  }
}
