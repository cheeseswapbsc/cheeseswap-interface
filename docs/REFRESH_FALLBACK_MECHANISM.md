# Refresh Button Fallback Mechanism

## Overview
This document describes the manual fallback mechanism that allows users to retry wallet connections using the generic injected connector when specific wallet connectors fail.

## User Flow

### 1. Initial Connection Attempt
When a user clicks on a specific wallet (e.g., "Trust Wallet", "MetaMask", "OKX Wallet"):

1. **WalletCard** component calls `login(connectorId)` with the specific connector ID
2. **ConnectWalletButton**'s `handleLogin` function:
   - Converts `ConnectorId` to `WalletType` 
   - Calls Web3Provider's `connect(walletType)` method
3. **Web3Provider** calls `connectWallet(walletType)` from connectors
4. **connectWallet** function:
   - Converts `WalletType` to `ConnectorId` using `walletTypeToConnectorId()`
   - Calls `ConnectorFactory.connect(connectorId)`
5. **ConnectorFactory** attempts connection with the specific connector

### 2. Connection Failure Handling
If the connection fails (wallet not installed, user rejection, timeout, etc.):

1. **ConnectorFactory** throws a `WalletNotAvailableError` or other error
2. Error propagates through:
   - `connectWallet()` → `Web3Provider.connect()` → `handleLogin()` → `WalletCard`
3. **WalletCard** catches the error and:
   - Sets `connectionError` state with error message
   - Displays error message below the wallet button
   - Shows "🔄 Refresh & Try Generic Connection" button (only for specific wallet connectors)

### 3. Manual Refresh Fallback
When user clicks the refresh button:

1. **WalletCard** calls `handleConnect(true)` where `true` indicates fallback mode
2. **WalletCard** calls `login('injected')` instead of the specific connector
3. Connection flow repeats with generic injected connector:
   - `handleLogin('injected')` → converts to `WalletType.METAMASK`
   - `Web3Provider.connect('METAMASK')` 
   - `connectWallet('METAMASK')` → `ConnectorFactory.connect('injected')`
4. **GenericInjectedConnector** attempts connection with `window.ethereum`
5. If successful, user is connected; if fails, shows error without refresh button

## Code Structure

### 1. Error Types (`src/connectors/errors.ts`)
```typescript
export class WalletConnectionError extends Error
export class WalletNotAvailableError extends WalletConnectionError
export class WalletConnectRejectedError extends WalletConnectionError
export class WalletConnectTimeoutError extends WalletConnectionError
```

### 2. ConnectorFactory Changes
**Before:**
```typescript
static async connect(connectorId: ConnectorId) {
  try {
    return await specificConnector.connect()
  } catch (error) {
    // Automatic fallback to injected
    return await injectedConnector.connect()
  }
}
```

**After:**
```typescript
static async connect(connectorId: ConnectorId) {
  const connector = this.getConnector(connectorId)
  if (!connector.isAvailable()) {
    throw new WalletNotAvailableError(connectorId)
  }
  // Let errors propagate - no automatic fallback
  return await connector.connect()
}
```

### 3. WalletCard Enhancement
**Added State:**
```typescript
const [connectionError, setConnectionError] = useState<string | null>(null)
const [isConnecting, setIsConnecting] = useState(false)
```

**Updated Logic:**
```typescript
const handleConnect = async (fallbackToInjected = false) => {
  try {
    const targetConnectorId = fallbackToInjected ? 'injected' : connectorId
    await login(targetConnectorId)
    // Success - close modal
  } catch (error) {
    // Show error and refresh button (for specific connectors only)
    setConnectionError(error.message)
  }
}

const handleRefresh = () => {
  handleConnect(true) // Retry with injected
}
```

**UI Updates:**
```tsx
<Button onClick={() => handleConnect(false)} disabled={isConnecting}>
  {isConnecting ? "Connecting..." : title}
</Button>

{connectionError && (
  <>
    <Text color="failure">{connectionError}</Text>
    {specificConnectors.includes(connectorId) && (
      <Button onClick={handleRefresh}>
        🔄 Refresh & Try Generic Connection
      </Button>
    )}
  </>
)}
```

### 4. Login Type Update
**Before:**
```typescript
export type Login = (connectorId: ConnectorId) => void
```

**After:**
```typescript
export type Login = (connectorId: ConnectorId) => Promise<void>
```

## Specific Connectors with Refresh Support
The refresh button appears only for these wallet types:
- `metamask` - MetaMask Connector
- `trustwallet` - Trust Wallet Connector
- `binance` - Binance Wallet Connector (if implemented)
- `okxwallet` - OKX Wallet Connector
- `fantomwallet` - Fantom Wallet Connector

**NOT shown for:**
- `injected` - Already generic, no fallback needed
- `walletconnect` - Uses QR/deep link, different flow
- `coinbasewallet` - Uses SDK, different flow

## Testing Scenarios

### Scenario 1: Trust Wallet In-App Browser
1. User opens app in Trust Wallet mobile browser
2. Clicks "Trust Wallet" button
3. If Trust Wallet connector fails to detect properly:
   - Error message appears
   - Refresh button shown
   - Click refresh → tries generic injected
   - Should connect successfully since `window.ethereum` exists

### Scenario 2: MetaMask Not Installed
1. User on desktop without MetaMask
2. Clicks "MetaMask" button
3. Error: "MetaMask is not available"
4. Refresh button shown
5. Click refresh → tries generic injected
6. Should fail if no wallet installed, or succeed if another wallet present

### Scenario 3: User Rejects Connection
1. User clicks wallet button
2. Wallet popup appears
3. User clicks "Cancel" or "Reject"
4. Error message shown with refresh button
5. Click refresh → retry with generic injected
6. User can accept this time

## Benefits

1. **User Control**: Manual retry gives users control instead of silent fallback
2. **Debugging**: Clear error messages help identify wallet issues
3. **Backward Compatibility**: Works with existing in-app browsers
4. **Flexibility**: Generic injected works with any `window.ethereum` wallet

## Migration from Automatic Fallback

**Old Behavior (Removed):**
- Specific connector fails → automatically tries injected
- Silent fallback, user doesn't know what happened
- May connect to wrong wallet

**New Behavior:**
- Specific connector fails → shows error + refresh button
- User explicitly chooses to retry with generic connector
- Clear feedback about what's happening

## Related Files
- `/src/connectors/errors.ts` - Error classes
- `/src/connectors/ConnectorFactory.ts` - Removed auto-fallback
- `/src/connectors/index.ts` - Backward compatible API
- `/cheeseswap-ui-sdk/src/widgets/WalletModal/WalletCard.tsx` - UI with refresh button
- `/cheeseswap-ui-sdk/src/widgets/WalletModal/types.ts` - Async Login type
- `/src/components/ConnectWalletButton/index.tsx` - Integration with Web3Provider

## Future Improvements

1. **Retry Counter**: Limit refresh attempts to prevent infinite loops
2. **Deep Link Fallback**: For mobile, try deep link before showing refresh
3. **Auto-Detection**: Suggest alternative wallets based on detected providers
4. **Download Links**: Show download button if wallet not installed
5. **Analytics**: Track which connectors fail most often to improve detection
