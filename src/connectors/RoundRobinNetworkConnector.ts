// import { ConnectorUpdate } from '@web3-react/types'
import { NetworkConnector } from './NetworkConnector'
import invariant from 'tiny-invariant'

interface RoundRobinNetworkConnectorArguments {
  urls: string[]
  chainId: number
  batchWaitTimeMs?: number
}

export class RoundRobinNetworkConnector extends NetworkConnector {
  private currentIndex: number
  private readonly urls: string[]
  private readonly batchWaitTimeMs?: number

  constructor({ urls, chainId, batchWaitTimeMs }: RoundRobinNetworkConnectorArguments) {
    invariant(urls.length > 0, 'At least one URL must be provided')

    // Start with the first URL
    super({
      urls: { [chainId]: urls[0] },
      defaultChainId: chainId
    })

    this.currentIndex = 0
    this.urls = urls
    this.batchWaitTimeMs = batchWaitTimeMs
  }

  public async getProvider() {
    // Rotate to the next URL
    this.currentIndex = (this.currentIndex + 1) % this.urls.length
    const newUrl = this.urls[this.currentIndex]

    // Get chainId through public method
    const chainId = await this.getChainId()

    // Get current provider through public method
    const currentProvider = await super.getProvider()

    // Check if we need to switch URLs
    if ((currentProvider as any).url !== newUrl) {
      // Create new provider instance using existing provider's constructor
      const newProvider = new (currentProvider.constructor as any)(
        chainId,
        newUrl,
        this.batchWaitTimeMs
      )

      // Update the provider
      ;(this as any).providers[chainId] = newProvider
      return newProvider
    }

    return currentProvider
  }

  public get provider() {
    // Get chainId through public method
    const chainId = this.getChainId() as unknown as number
    return (this as any).providers[chainId] || super.getProvider()
  }
}
