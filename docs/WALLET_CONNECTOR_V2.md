# CheeseSwap Wallet Connector System v2

## Overview

Complete wallet connector system with WalletConnect v2, modular architecture, and universal injected wallet support.

## Key Features

✅ **WalletConnect v2** - Modern WalletConnect SDK with improved QR modal  
✅ **Modular Architecture** - Each wallet has its own connector class  
✅ **Universal Injected Fallback** - Generic connector supports ANY wallet with `window.ethereum`  
✅ **Smart Detection** - Priority-based wallet selection  
✅ **Mobile Support** - Deep links and mobile-optimized wallet selection  
✅ **Auto-fallback** - Graceful degradation if specific wallet not detected  

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   ConnectorFactory                           │
│  (Smart connector selection with fallback logic)            │
└──────────────────┬──────────────────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
┌─────────────┐         ┌──────────────┐
│  Specific   │         │   Generic    │
│  Wallets    │         │   Injected   │
├─────────────┤         ├──────────────┤
│ MetaMask    │         │ ANY wallet   │
│ Binance     │         │ with         │
│ Trust       │ ──────► │ window.      │
│ OKX         │ fallback│ ethereum     │
│ Fantom      │         │              │
└─────────────┘         └──────────────┘
       │
       ▼
┌──────────────┐
│  SDK Wallets │
├──────────────┤
│ WalletCon... │
│ Coinbase...  │
└──────────────┘
```

## Connector Priority

1. **Specific Wallets** (priority 1-10)
   - MetaMask
   - Binance Wallet
   - Trust Wallet
   - OKX Wallet
   - Fantom Wallet

2. **Generic Injected** (priority 50)
   - Catches ANY `window.ethereum` wallet not specifically detected
   - Examples: Rabby, Brave Wallet, Frame, Rainbow, etc.

3. **SDK Wallets** (priority 98-99)
   - WalletConnect (always available)
   - Coinbase Wallet (always available)

## Usage

### Connect to Specific Wallet

```typescript
import { ConnectorFactory } from './connectors/ConnectorFactory'

// Connect to MetaMask
const provider = await ConnectorFactory.connect('metamask')

// Connect to Trust Wallet
const provider = await ConnectorFactory.connect('trustwallet')

// Connect to ANY injected wallet (fallback)
const provider = await ConnectorFactory.connect('injected')
```

### Auto-Connect

```typescript
// Auto-detect best available wallet
const { provider, connectorId } = await ConnectorFactory.autoConnect()
console.log(`Connected with: ${connectorId}`)
```

### Check Available Wallets

```typescript
const wallets = ConnectorFactory.getAvailableConnectors()
wallets.forEach(wallet => {
  console.log(`${wallet.name}: ${wallet.available ? 'Available' : 'Not Available'}`)
})
```

## Configuration

### Environment Variables

Add to your `.env` file:

```bash
# WalletConnect Project ID (required)
REACT_APP_WALLETCONNECT_PROJECT_ID=your_project_id_here

# RPC URLs for BSC Mainnet
REACT_APP_NETWORK_URL_1=https://bsc-dataseed1.binance.org
REACT_APP_NETWORK_URL_2=https://bsc-dataseed2.binance.org
# ... more RPC URLs for redundancy
```

Get your WalletConnect Project ID from: https://cloud.walletconnect.com/

## Mobile Support

### Deep Links

The system supports deep links for mobile wallets:

- **MetaMask**: `metamask.app.link/dapp/...`
- **Trust Wallet**: `link.trustwallet.com/open_url?...`
- **OKX Wallet**: `okx.com/download?deeplink=...`

### Mobile Behavior

On mobile devices:
1. Shows **installed wallets** first
2. Shows wallets with **deep links** (can open mobile app)
3. Shows **WalletConnect** (QR code or universal link)
4. Hides desktop-only wallets

## Fallback Strategy

The connector system has multiple fallback levels:

```
1. Try specific wallet (e.g., MetaMask)
   ↓ (if not available)
2. Try generic injected wallet
   ↓ (if no injected wallet)
3. Use WalletConnect
```

This ensures NO wallet is left unsupported!

## Files Changed

### Backend (cheeseswap-dev-v2-3-1)

- `src/connectors/BaseConnector.ts` ✨ NEW
- `src/connectors/ConnectorFactory.ts` ✨ NEW  
- `src/connectors/InjectedConnector.ts` ♻️ REFACTORED
- `src/connectors/WalletConnectProvider.ts` ♻️ UPDATED (v2)
- `src/connectors/CoinbaseWalletProvider.ts` ♻️ UPDATED
- `src/connectors/index.ts` ♻️ UPDATED
- `src/connectors/wallets/MetaMaskConnector.ts` ✨ NEW
- `src/connectors/wallets/BinanceWalletConnector.ts` ✨ NEW
- `src/connectors/wallets/TrustWalletConnector.ts` ✨ NEW
- `src/connectors/wallets/OKXWalletConnector.ts` ✨ NEW
- `src/connectors/wallets/FantomWalletConnector.ts` ✨ NEW
- `package.json` ♻️ UPDATED (WalletConnect v2)

### UI SDK (cheeseswap-ui-sdk)

- `src/widgets/WalletModal/detection.ts` ✨ NEW
- `src/widgets/WalletModal/config.tsx` ♻️ UPDATED
- `src/widgets/WalletModal/types.ts` ♻️ UPDATED
- `src/widgets/WalletModal/ConnectModal.tsx` ♻️ UPDATED
- `src/widgets/WalletModal/icons/OKXWallet.tsx` ✨ NEW
- `src/widgets/WalletModal/icons/FantomWallet.tsx` ✨ NEW
- `src/widgets/WalletModal/icons/CoinbaseWallet.tsx` ✨ NEW
- `src/widgets/WalletModal/icons/BrowserWallet.tsx` ✨ NEW

## Migration Guide

### From Old System

```typescript
// OLD WAY
import { connectWallet } from './connectors'
const provider = await connectWallet('METAMASK') // WalletType enum

// NEW WAY  
import { ConnectorFactory } from './connectors/ConnectorFactory'
const provider = await ConnectorFactory.connect('metamask') // ConnectorId string
```

### Legacy Support

For backward compatibility, use the helper:

```typescript
import { walletTypeToConnectorId } from './connectors'

const oldType = 'METAMASK' // WalletType
const newId = walletTypeToConnectorId(oldType) // 'metamask' ConnectorId
```

## Testing

### Desktop Browser
- Install MetaMask → Should detect and show as "installed"
- Install Trust Wallet → Should detect and show as "installed"
- No wallet installed → Should show "Browser Wallet" if `window.ethereum` exists
- No `window.ethereum` → Should only show WalletConnect

### Mobile Browser
- Trust Wallet app → Should detect and show first
- MetaMask app → Should detect and show first
- No wallet app → Should show WalletConnect with QR

### Unknown Wallets
- Install Rabby Wallet → Should show "Browser Wallet" (generic injected)
- Install Brave Wallet → Should show "Browser Wallet" (generic injected)
- Any wallet with `window.ethereum` → Will work!

## Troubleshooting

### WalletConnect not working
- Check `REACT_APP_WALLETCONNECT_PROJECT_ID` is set
- Verify project ID is valid at cloud.walletconnect.com
- Check browser console for errors

### Wallet not detected
- Refresh page after installing wallet extension
- Check if wallet is enabled/unlocked
- Try "Browser Wallet" option (generic injected)

### Wrong network
- Connectors automatically switch to BSC Mainnet (chainId 56)
- If switch fails, wallet will prompt user to add BSC network

## Benefits

✅ **No wallet left behind** - Generic injected catches everything  
✅ **Mobile-first** - Proper mobile wallet support  
✅ **Modern** - WalletConnect v2 with better UX  
✅ **Maintainable** - Modular architecture, easy to add new wallets  
✅ **Reliable** - Multiple fallback levels  
✅ **Future-proof** - Works with wallets that don't exist yet!  

## Adding New Wallets

To add a new specific wallet:

1. Create connector in `src/connectors/wallets/NewWalletConnector.ts`
2. Add detection function in `cheeseswap-ui-sdk/src/widgets/WalletModal/detection.ts`
3. Add icon in `cheeseswap-ui-sdk/src/widgets/WalletModal/icons/NewWallet.tsx`
4. Add config in `cheeseswap-ui-sdk/src/widgets/WalletModal/config.tsx`
5. Register in `ConnectorFactory.ts`

That's it! The wallet will automatically be supported across the entire app.
