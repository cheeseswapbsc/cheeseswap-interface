import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3 } from '../providers/Web3Provider'
import { getNetworkLibrary, CHAIN_ID } from '../connectors'

// Re-export useWeb3 hook
export { useWeb3 }

// Alias for backward compatibility
export function useActiveWeb3React() {
  const web3Context = useWeb3()

  // Read-only fallback: browse the app without a connected wallet.
  // Cast is safe: Web3Provider-only members are used only once connected.
  const library = (web3Context.provider || getNetworkLibrary()) as ethers.providers.Web3Provider
  const chainId = web3Context.chainId !== null ? web3Context.chainId : CHAIN_ID

  return {
    library,
    provider: library,
    account: web3Context.account,
    chainId,
    active: web3Context.isConnected,
    connector: null,
    activate: web3Context.connect,
    deactivate: web3Context.disconnect,
    error: web3Context.error ? new Error(web3Context.error) : undefined
  }
}

export function useEagerConnect() {
  const { isConnected } = useWeb3()
  const [tried, setTried] = useState(false)

  useEffect(() => {
    // Auto-reconnect happens in Web3Provider
    // Just set tried to true after a delay
    const timer = setTimeout(() => {
      setTried(true)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isConnected) {
      setTried(true)
    }
  }, [isConnected])

  return tried
}

export function useInactiveListener(suppress = false) {
  // Event listeners are handled in Web3Provider
  // This is kept for compatibility but does nothing
  useEffect(() => {
    // No-op
  }, [suppress])
}
