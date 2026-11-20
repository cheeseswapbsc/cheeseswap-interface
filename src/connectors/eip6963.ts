/**
 * EIP-6963: Multi Injected Provider Discovery
 * https://eips.ethereum.org/EIPS/eip-6963
 *
 * Modern wallet discovery mechanism. Instead of sniffing flags on a single
 * shared `window.ethereum` object (isMetaMask / isTrust / ...), every
 * installed wallet announces itself with its own provider instance,
 * human-readable name, icon and a reverse-DNS identifier (rdns).
 */

export interface EIP1193Provider {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>
  on?(event: string, listener: (...args: any[]) => void): void
  removeListener?(event: string, listener: (...args: any[]) => void): void
}

export interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string // data URI
  rdns: string // e.g. "io.metamask", "com.trustwallet.app", "com.okex.wallet"
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: EIP1193Provider
}

interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: 'eip6963:announceProvider'
  detail: EIP6963ProviderDetail
}

type Listener = (providers: EIP6963ProviderDetail[]) => void

/**
 * Singleton store of all wallets discovered via EIP-6963.
 * Starts listening as soon as the module is imported.
 */
class EIP6963Store {
  private providers = new Map<string, EIP6963ProviderDetail>()
  private listeners = new Set<Listener>()
  private started = false

  start(): void {
    if (this.started || typeof window === 'undefined') return
    this.started = true

    window.addEventListener('eip6963:announceProvider', ((event: EIP6963AnnounceProviderEvent) => {
      const detail = event.detail
      if (!detail || !detail.info || !detail.provider || !detail.info.rdns) return
      const existing = this.providers.get(detail.info.rdns)
      // Freeze-safe: wallets may re-announce, only update when provider changes
      if (existing && existing.provider === detail.provider) return
      this.providers.set(detail.info.rdns, {
        info: { ...detail.info },
        provider: detail.provider
      })
      this.emit()
    }) as EventListener)

    // Ask all installed wallets to announce themselves
    this.requestProviders()
  }

  /** Re-dispatch the request event (wallets respond synchronously). */
  requestProviders(): void {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new Event('eip6963:requestProvider'))
  }

  getProviders(): EIP6963ProviderDetail[] {
    return Array.from(this.providers.values())
  }

  getProvider(rdns: string): EIP6963ProviderDetail | undefined {
    return this.providers.get(rdns)
  }

  /** Find a provider by rdns, with a short grace period for late injection. */
  async waitForProvider(rdns: string, timeoutMs = 1500): Promise<EIP6963ProviderDetail | undefined> {
    const existing = this.getProvider(rdns)
    if (existing) return existing

    this.requestProviders()

    return new Promise(resolve => {
      const timer = setTimeout(() => {
        unsubscribe()
        resolve(this.getProvider(rdns))
      }, timeoutMs)

      const unsubscribe = this.subscribe(() => {
        const found = this.getProvider(rdns)
        if (found) {
          clearTimeout(timer)
          unsubscribe()
          resolve(found)
        }
      })
    })
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit(): void {
    const snapshot = this.getProviders()
    this.listeners.forEach(listener => {
      try {
        listener(snapshot)
      } catch (err) {
        console.error('[EIP6963] listener error:', err)
      }
    })
  }
}

export const eip6963Store = new EIP6963Store()
eip6963Store.start()

/**
 * Well-known rdns values, used to map legacy WalletType identifiers
 * onto EIP-6963 discovered providers when available.
 */
export const KNOWN_WALLET_RDNS: { [rdns: string]: string } = {
  'io.metamask': 'MetaMask',
  'io.metamask.flask': 'MetaMask Flask',
  'com.trustwallet.app': 'Trust Wallet',
  'com.okex.wallet': 'OKX Wallet',
  'com.binance.wallet': 'Binance Wallet',
  'com.coinbase.wallet': 'Coinbase Wallet',
  'com.brave.wallet': 'Brave Wallet',
  'app.phantom': 'Phantom',
  'io.rabby': 'Rabby Wallet',
  'io.zerion.wallet': 'Zerion',
  'com.bitget.web3': 'Bitget Wallet',
  'pro.tokenpocket': 'TokenPocket',
  'com.safepal': 'SafePal',
  'io.xdefi': 'Ctrl Wallet'
}
