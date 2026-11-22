import { BrowserProvider, Eip1193Provider } from 'ethers'

export default function getLibrary(provider: Eip1193Provider): BrowserProvider {
  const library = new BrowserProvider(provider)
  library.pollingInterval = 5000
  return library
}
