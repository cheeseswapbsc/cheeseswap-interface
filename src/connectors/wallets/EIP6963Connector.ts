import { ethers } from 'ethers'
import { BaseWalletConnector } from '../BaseConnector'
import { eip6963Store, EIP6963ProviderDetail } from '../eip6963'
import { ensureBSCMainnet } from '../utils'
import { UserRejectedError } from '../errors'

/**
 * EIP-6963 connector
 * Connects to a specific wallet discovered via EIP-6963 announcement,
 * identified by its rdns (e.g. "io.metamask").
 */
export class EIP6963Connector extends BaseWalletConnector {
  private detail: EIP6963ProviderDetail | null = null
  private rdns: string | null = null

  constructor() {
    super('Discovered Wallet')
  }

  isAvailable(): boolean {
    return eip6963Store.getProviders().length > 0
  }

  getName(): string {
    return this.detail ? this.detail.info.name : this.walletName
  }

  getRdns(): string | null {
    return this.rdns
  }

  getInjectedProvider(): any {
    return this.detail ? this.detail.provider : null
  }

  /**
   * Connect to a discovered wallet by rdns (prompts the user).
   */
  async connect(rdns?: string): Promise<ethers.BrowserProvider> {
    const detail = await this.resolveDetail(rdns)

    try {
      const accounts = (await detail.provider.request({
        method: 'eth_requestAccounts'
      })) as string[]

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet')
      }

      this.detail = detail
      this.rdns = detail.info.rdns
      this.eip1193 = detail.provider as any
      this.provider = new ethers.BrowserProvider(detail.provider as any)

      await ensureBSCMainnet(this.provider)

      console.log(`[EIP6963] Connected to ${detail.info.name} (${detail.info.rdns})`)
      return this.provider
    } catch (error) {
      this.detail = null
      this.rdns = null
      this.provider = null
      if ((error as any)?.code === 4001) {
        throw new UserRejectedError(detail.info.name)
      }
      throw error
    }
  }

  /**
   * Silent reconnect: only succeeds when the wallet already authorized
   * this site (uses eth_accounts, never triggers a popup).
   */
  async eagerConnect(rdns: string): Promise<ethers.BrowserProvider | null> {
    const detail = await eip6963Store.waitForProvider(rdns)
    if (!detail) return null

    try {
      const accounts = (await detail.provider.request({ method: 'eth_accounts' })) as string[]
      if (!accounts || accounts.length === 0) return null

      this.detail = detail
      this.rdns = detail.info.rdns
      this.eip1193 = detail.provider as any
      this.provider = new ethers.BrowserProvider(detail.provider as any)
      console.log(`[EIP6963] Eagerly reconnected to ${detail.info.name}`)
      return this.provider
    } catch (error) {
      console.warn('[EIP6963] Eager connect failed:', error)
      return null
    }
  }

  async disconnect(): Promise<void> {
    const injected: any = this.detail ? this.detail.provider : null
    this.detail = null
    this.rdns = null
    this.provider = null

    // EIP-2255: best-effort permission revocation (supported by MetaMask & co.)
    if (injected && typeof injected.request === 'function') {
      try {
        await injected.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }]
        })
      } catch {
        // Wallet doesn't support revocation - local disconnect is enough
      }
    }
  }

  private async resolveDetail(rdns?: string): Promise<EIP6963ProviderDetail> {
    if (rdns) {
      const detail = await eip6963Store.waitForProvider(rdns)
      if (!detail) {
        throw new Error(`Wallet ${rdns} is not available. Make sure the extension is installed and enabled.`)
      }
      return detail
    }
    const all = eip6963Store.getProviders()
    if (all.length === 0) {
      throw new Error('No EIP-6963 wallets discovered')
    }
    return all[0]
  }
}

export const eip6963Connector = new EIP6963Connector()
