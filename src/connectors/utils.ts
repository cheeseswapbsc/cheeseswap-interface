// ...existing code...
import type { WalletType } from '../global';
export type { WalletType } from '../global';

export interface WalletInfo {
  type: WalletType;
  name: string;
  iconName: string;
  description: string;
  color: string;
  connectorId: string;
  primary?: boolean;
  mobile?: boolean;
  mobileOnly?: boolean;
}

export const SUPPORTED_WALLETS: { [key in WalletType | 'BINANCE']?: WalletInfo } = {
  INJECTED: {
    type: 'INJECTED',
    name: 'Injected',
    iconName: 'injected.png',
    description: 'Any browser-injected wallet',
    color: '#666',
    connectorId: 'injected',
    primary: true,
    mobile: true,
  },
  METAMASK: {
    type: 'METAMASK',
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'MetaMask browser extension and mobile app',
    color: '#f6851b',
    connectorId: 'metamask',
    primary: true,
    mobile: true,
  },
  BINANCE: {
    type: 'BINANCE',
    name: 'Binance Wallet',
    iconName: 'binance.svg',
    description: 'Binance Chain Wallet extension',
    color: '#f3ba2f',
    connectorId: 'binance',
    mobile: true,
  },
  TRUST_WALLET: {
    type: 'TRUST_WALLET',
    name: 'Trust Wallet',
    iconName: 'trustWallet.png',
    description: 'Trust Wallet browser and app',
    color: '#3375bb',
    connectorId: 'trustwallet',
    mobile: true,
  },
  OKX_WALLET: {
    type: 'OKX_WALLET',
    name: 'OKX Wallet',
    iconName: 'okxWallet.png',
    description: 'OKX Wallet extension and app',
    color: '#000',
    connectorId: 'okxwallet',
    mobile: true,
  },
  FANTOM_WALLET: {
    type: 'FANTOM_WALLET',
    name: 'Fantom Wallet',
    iconName: 'fantomWallet.png',
    description: 'Fantom Wallet extension',
    color: '#1969ff',
    connectorId: 'fantomwallet',
  },
  WALLETCONNECT: {
    type: 'WALLETCONNECT',
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'WalletConnect QR and mobile',
    color: '#4196fc',
    connectorId: 'walletconnect',
    mobile: true,
  },
  COINBASE: {
    type: 'COINBASE',
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Coinbase Wallet app',
    color: '#1652f0',
    connectorId: 'coinbasewallet',
    mobile: true,
  },
};



export interface DetectedWallet {
  type: WalletType;
  name: string;
  installed: boolean;
}

export function detectInstalledWallets(): DetectedWallet[] {
  const eth = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const detected: DetectedWallet[] = [];
  for (const key of Object.keys(SUPPORTED_WALLETS) as WalletType[]) {
    let installed = false;
    switch (key) {
      case 'INJECTED':
        installed = !!eth;
        break;
      case 'METAMASK':
        installed = !!(eth?.isMetaMask && !eth?.isTrust && !eth?.isFTM && !eth?.isTokenPocket && !(eth as any)?.isBinance && !(eth as any)?.isOKXWallet);
        break;
      case 'BINANCE':
        installed = !!(eth?.isBinance || (window as any).BinanceChain);
        break;
      case 'TRUST_WALLET':
        installed = !!(eth?.isTrust || eth?.isTrustWallet || (window as any).trustwallet || (isMobile && eth && eth.isMetaMask === undefined && eth.isTrust === undefined && eth.isTokenPocket === undefined && eth.isBinance === undefined && eth.isOKXWallet === undefined));
        break;
      case 'OKX_WALLET':
        installed = !!((window as any).okxwallet || eth?.isOKXWallet);
        break;
      case 'FANTOM_WALLET':
        installed = !!((window as any).ftmwallet || eth?.isFTM);
        break;
      case 'WALLETCONNECT':
      case 'COINBASE':
        installed = true;
        break;
    }
    detected.push({
      type: key as WalletType,
      name: SUPPORTED_WALLETS[key]?.name || key,
      installed,
    });
  }
  return detected;
}

// Ensures the provider is connected to BSC Mainnet (chainId 56)
export async function ensureBSCMainnet(provider: any): Promise<void> {
  const BSC_CHAIN_ID = 56;
  const BSC_CHAIN_ID_HEX = '0x38';
  const BSC_PARAMS = {
    chainId: BSC_CHAIN_ID_HEX,
    chainName: 'BNB Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed2.binance.org/',
      'https://bsc-dataseed3.binance.org/',
      'https://bsc-dataseed1.bnbchain.org/',
      'https://bsc-dataseed.defibit.io/',
      'https://bsc-dataseed.ninicoin.io'
    ],
    blockExplorerUrls: ['https://bscscan.com']
  };

  let currentChainId: string | number | undefined;
  if (provider && provider.send) {
    // ethers v5 provider
    currentChainId = (await provider.send('eth_chainId', [])) || (await provider.getNetwork()).chainId;
  } else if (provider && provider.request) {
    // EIP-1193 provider
    currentChainId = await provider.request({ method: 'eth_chainId' });
  }
  if (typeof currentChainId === 'string') {
    if (currentChainId.startsWith('0x')) {
      currentChainId = parseInt(currentChainId, 16);
    } else {
      currentChainId = parseInt(currentChainId, 10);
    }
  }
  if (currentChainId !== BSC_CHAIN_ID) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID_HEX }]
      });
    } catch (switchError) {
      // 4902 = chain not added
      if (switchError.code === 4902 || (switchError.data && switchError.data.originalError && switchError.data.originalError.code === 4902)) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [BSC_PARAMS]
        });
      } else {
        throw switchError;
      }
    }
  }
}

export function getWalletProvider(walletType: WalletType): any {
  if (typeof window === 'undefined') return null;
  switch (walletType) {
    case 'METAMASK':
      // MetaMask injects window.ethereum and sets isMetaMask
      if (window.ethereum && window.ethereum.isMetaMask) return window.ethereum;
      return null;
    case 'TRUST_WALLET':
      // Trust Wallet injects window.ethereum and sets isTrust
      if (window.ethereum && window.ethereum.isTrust) return window.ethereum;
      return null;
    case 'OKX_WALLET':
      // OKX Wallet injects window.okxwallet or window.ethereum with isOkxWallet
      if ((window as any).okxwallet) return (window as any).okxwallet;
      if (window.ethereum && (window.ethereum as any).isOkxWallet) return window.ethereum;
      return null;
    case 'FANTOM_WALLET':
      // Fantom Wallet injects window.ftmwallet or window.ethereum with isFantom
      if ((window as any).ftmwallet) return (window as any).ftmwallet;
      if (window.ethereum && (window.ethereum as any).isFantom) return window.ethereum;
      return null;
    case 'BINANCE':
      // Binance Wallet injects window.BinanceChain or window.ethereum with isBinanceChain
      if ((window as any).BinanceChain) return (window as any).BinanceChain;
      if (window.ethereum && (window.ethereum as any).isBinanceChain) return window.ethereum;
      return null;
    case 'INJECTED':
      // Fallback: any injected provider
      if (window.ethereum) return window.ethereum;
      return null;
    default:
      return null;
  }
}

// Returns true if the given wallet type is installed in the browser
export function isWalletInstalled(walletType: WalletType): boolean {
  const eth = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  switch (walletType) {
    case 'INJECTED':
      return !!eth;
    case 'METAMASK':
      return !!(eth?.isMetaMask && !eth?.isTrust && !eth?.isFTM && !eth?.isTokenPocket && !(eth as any)?.isBinance && !(eth as any)?.isOKXWallet);
    case 'BINANCE':
      return !!(eth?.isBinance || (window as any).BinanceChain);
    case 'TRUST_WALLET':
      return !!(eth?.isTrust || eth?.isTrustWallet || (window as any).trustwallet || (isMobile && eth && eth.isMetaMask === undefined && eth.isTrust === undefined && eth.isTokenPocket === undefined && eth.isBinance === undefined && eth.isOKXWallet === undefined));
    case 'OKX_WALLET':
      return !!((window as any).okxwallet || eth?.isOKXWallet);
    case 'FANTOM_WALLET':
      return !!((window as any).ftmwallet || eth?.isFTM);
    case 'WALLETCONNECT':
    case 'COINBASE':
      return true;
    default:
      return false;
  }
}

// Attaches wallet event listeners and returns a cleanup function
export function setupWalletListeners(
  provider: any,
  onAccountsChanged?: (accounts: string[]) => void,
  onChainChanged?: (chainId: string) => void,
  onDisconnect?: (error?: any) => void
): () => void {
  if (!provider || typeof provider.on !== 'function') return () => { };

  if (onAccountsChanged) provider.on('accountsChanged', onAccountsChanged);
  if (onChainChanged) provider.on('chainChanged', onChainChanged);
  if (onDisconnect) provider.on('disconnect', onDisconnect);

  // Cleanup function to remove listeners
  return () => {
    if (onAccountsChanged) provider.removeListener('accountsChanged', onAccountsChanged);
    if (onChainChanged) provider.removeListener('chainChanged', onChainChanged);
    if (onDisconnect) provider.removeListener('disconnect', onDisconnect);
  };
}
