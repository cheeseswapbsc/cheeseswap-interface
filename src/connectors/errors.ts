/**
 * Custom error classes for wallet connector failures
 */

export class WalletConnectionError extends Error {
  constructor(message: string, public connectorId: string) {
    super(message)
    this.name = 'WalletConnectionError'
  }
}

export class WalletNotAvailableError extends WalletConnectionError {
  constructor(connectorId: string) {
    super(`${connectorId} is not available`, connectorId)
    this.name = 'WalletNotAvailableError'
  }
}

export class WalletConnectRejectedError extends WalletConnectionError {
  constructor(connectorId: string) {
    super(`User rejected connection to ${connectorId}`, connectorId)
    this.name = 'WalletConnectRejectedError'
  }
}

export class WalletConnectTimeoutError extends WalletConnectionError {
  constructor(connectorId: string) {
    super(`Connection to ${connectorId} timed out`, connectorId)
    this.name = 'WalletConnectTimeoutError'
  }
}
