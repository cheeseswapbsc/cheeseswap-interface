import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useWeb3 } from '../../hooks'

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
  const { error } = useWeb3()

  // if there's an irrecoverable error
  if (error) {
    return (
      <MessageWrapper>
        <Message>{t('unknownError')}</Message>
      </MessageWrapper>
    )
  }

  // Always render children - no need to wait for wallet connection
  return children
}
