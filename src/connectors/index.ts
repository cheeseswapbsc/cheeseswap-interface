import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { FortmaticConnector } from './Fortmatic'
// import { NetworkConnector } from './NetworkConnector'
import { BscConnector } from './bsc/bscConnector'
import { RoundRobinNetworkConnector } from './RoundRobinNetworkConnector'

const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID
const NETWORK_URLS = [
  process.env.REACT_APP_NETWORK_URL_1,
  process.env.REACT_APP_NETWORK_URL_2,
  process.env.REACT_APP_NETWORK_URL_3,
  process.env.REACT_APP_NETWORK_URL_4,
  process.env.REACT_APP_NETWORK_URL_5,
  process.env.REACT_APP_NETWORK_URL_6
].filter(url => typeof url === 'string') as string[]

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '56')

if (NETWORK_URLS.length === 0) {
  throw new Error(`At least one RPC URL must be defined in environment variables`)
}

export const network = new RoundRobinNetworkConnector({
  urls: NETWORK_URLS,
  chainId: NETWORK_CHAIN_ID,
  batchWaitTimeMs: 50 // optional, same as your original
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [56, 97]
})

export const bsc = new BscConnector({ supportedChainIds: [56] })

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URLS[0] }, // Use the first URL from the array
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1]
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URLS[0], // Use the first URL from the array
  appName: 'Uniswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
})
