/// <reference types="react-scripts" />

declare module 'jazzicon' {
  export default function(diameter: number, seed: number): HTMLElement
}

interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isTrust?: boolean
    isFTM?: boolean
    isTokenPocket?: boolean
    request: (args: { method: string; params?: any[] }) => Promise<any>
    on?: (event: string, handler: (...args: any[]) => void) => void
    removeListener?: (event: string, handler: (...args: any[]) => void) => void
    selectedAddress?: string
    chainId?: string
  }
  okxwallet?: {
    isOkxWallet?: boolean
    request: (args: { method: string; params?: any[] }) => Promise<any>
    on?: (event: string, handler: (...args: any[]) => void) => void
    removeListener?: (event: string, handler: (...args: any[]) => void) => void
  }
  web3?: any
  BinanceChain?: BinanceChain
}

declare module 'content-hash' {
  declare function decode(x: string): string
  declare function getCodec(x: string): string
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array }
  declare function toB58String(hash: Uint8Array): string
}

interface BinanceChain {
  send: unknown
  enable: () => Promise<string[]>
  on?: (method: string, listener: (...args: any[]) => void) => void
  removeListener?: (method: string, listener: (...args: any[]) => void) => void
}
