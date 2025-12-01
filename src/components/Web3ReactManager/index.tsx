import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useWeb3 } from '../../hooks'
import { CHAIN_ID, NETWORK_NAME } from '../../connectors'
import { useState } from 'react'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.colors.text2};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { t } = useTranslation()
  const { error, chainId, account, connect, walletType } = useWeb3()
  const [reconnecting, setReconnecting] = useState(false)

  // Retry connection handler
  const handleRetry = async () => {
    setReconnecting(true)
    try {
      if (walletType) {
        await connect(walletType)
      }
    } catch (err) {
      // error will be shown by context
    } finally {
      setReconnecting(false)
    }
  }

  // Show error if wallet or network is wrong
  if (error) {
    return (
      <MessageWrapper>
        <Message>{t('unknownError')}</Message>
        <button onClick={handleRetry} disabled={reconnecting} style={{ marginLeft: 16, padding: '8px 18px', borderRadius: 8, border: 'none', background: '#f7b500', color: '#222', fontWeight: 600, cursor: 'pointer' }}>{reconnecting ? 'Reconnecting...' : 'Retry'}</button>
      </MessageWrapper>
    )
  }

  // Show unsupported network message
  if (account && chainId && chainId !== CHAIN_ID) {
    const handleSwitchNetwork = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + CHAIN_ID.toString(16) }]
          })
        } catch (err) {
          // error will be shown by context
        }
      }
    }
    return (
      <MessageWrapper>
        <Message>{t('wrongNetwork', `Please connect to the ${NETWORK_NAME} network.`)}</Message>
        <button onClick={handleSwitchNetwork} style={{ marginLeft: 16, padding: '8px 18px', borderRadius: 8, border: 'none', background: '#f7b500', color: '#222', fontWeight: 600, cursor: 'pointer' }}>Switch Network</button>
      </MessageWrapper>
    )
  }

  // Show missing provider message
  if (!window.ethereum && !window.web3 && !account) {
    return (
      <MessageWrapper>
        <Message>{t('missingProvider', 'No Ethereum provider detected. Please install MetaMask or another wallet extension.')}</Message>
        <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 16, color: '#f7b500', fontWeight: 600 }}>Get MetaMask</a>
      </MessageWrapper>
    )
  }

  // Only render children if wallet/network is valid
  return children
}
