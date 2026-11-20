import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useWeb3 } from '../../hooks'
import { CHAIN_ID, NETWORK_NAME } from '../../connectors'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.colors.text2};
`

const ActionButton = styled.button`
  margin-left: 16px;
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background: #f7b500;
  color: #222;
  font-weight: 600;
  cursor: pointer;
`

/**
 * Modern connection manager:
 * - The app always renders read-only (via the fallback RPC provider) when no
 *   wallet is connected, so users without extensions can still browse and
 *   connect through WalletConnect.
 * - Connection errors are surfaced in the wallet modal, not as a full-page block.
 * - Only a connected account on the wrong network blocks interaction, with a
 *   one-click switch back to BSC.
 */
export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { t } = useTranslation()
  const { chainId, account, switchNetwork } = useWeb3()

  // Show unsupported network message for connected accounts
  if (account && chainId && chainId !== CHAIN_ID) {
    return (
      <MessageWrapper>
        <Message>{t('wrongNetwork', `Please connect to the ${NETWORK_NAME} network.`)}</Message>
        <ActionButton onClick={() => switchNetwork()}>Switch Network</ActionButton>
      </MessageWrapper>
    )
  }

  return children
}
