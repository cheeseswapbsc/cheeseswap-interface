import React, { useEffect } from 'react'
import styled from 'styled-components'

const TARGET_URL = 'https://app.debridge.com/r/32773'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 560px;
  min-height: 240px;
  text-align: center;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.bg1};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
`

const Title = styled.h2`
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text1};
`

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text2};
`
export default function CrossChainBridge() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      window.location.replace(TARGET_URL)
    }, 400)

    return () => window.clearTimeout(id)
  }, [])

  return (
    <Wrapper>
      <Title>Cross Chain Bridge</Title>
      <Message>Redirecting you to our cross-chain partner experience…</Message>
    </Wrapper>
  )
}
