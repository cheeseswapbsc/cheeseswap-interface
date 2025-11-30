
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { BaseWalletConnector } from './BaseConnector';
import { ensureBSCMainnet } from './utils';

const BSC_CHAIN_ID = 56;
const BSC_RPC_URL = 'https://bsc-dataseed1.binance.org';

export class CheeseSwapWalletConnect extends BaseWalletConnector {
  private wcProvider: WalletConnectProvider | null = null;

  constructor() {
    super('WalletConnect');
  }

  isAvailable(): boolean {
    return true;
  }

  async connect(): Promise<ethers.providers.Web3Provider> {
    try {
      console.log('[WalletConnect] Initializing WalletConnect v1...');
      this.wcProvider = new WalletConnectProvider({
        rpc: {
          [BSC_CHAIN_ID]: BSC_RPC_URL
        },
        chainId: BSC_CHAIN_ID,
        qrcode: true
      });

      // Enable session (triggers QR Code modal)
      await this.wcProvider.enable();

      this.provider = new ethers.providers.Web3Provider(this.wcProvider as any, 'any');

      // Ensure we're on BSC Mainnet
      await ensureBSCMainnet(this.provider);

      // Setup event listeners
      this.setupWalletConnectListeners();

      console.log('[WalletConnect] Successfully connected');
      return this.provider;
    } catch (error) {
      console.error('[WalletConnect] Connection error:', error);
      await this.disconnect();
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.wcProvider) {
      try {
        await this.wcProvider.disconnect();
      } catch (error) {
        console.error('[WalletConnect] Error disconnecting:', error);
      }
    }
    this.wcProvider = null;
    this.provider = null;
  }

  private setupWalletConnectListeners(): void {
    if (!this.wcProvider) return;

    this.wcProvider.on('accountsChanged', (accounts: string[]) => {
      console.log('[WalletConnect] Accounts changed:', accounts);
      if (accounts.length === 0) {
        this.disconnect();
      }
    });

    this.wcProvider.on('chainChanged', (chainId: number) => {
      console.log('[WalletConnect] Chain changed:', chainId);
      if (chainId !== BSC_CHAIN_ID) {
        console.warn('[WalletConnect] Wrong network, please switch to BSC');
      }
    });

    this.wcProvider.on('disconnect', (error: any) => {
      console.log('[WalletConnect] Disconnected:', error);
      this.disconnect();
    });
  }
}

export const walletConnectConnector = new CheeseSwapWalletConnect();
