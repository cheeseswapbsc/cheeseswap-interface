import { useEffect, useState } from 'react'
import { useWeb3 } from '../providers/Web3Provider'

// Re-export useWeb3 hook
export { useWeb3 }

// Alias for backward compatibility
export function useActiveWeb3React() {
  const web3Context = useWeb3()
  
  return {
    library: web3Context.provider,
    provider: web3Context.provider,
    account: web3Context.account,
    chainId: web3Context.chainId,
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
