import React from 'react'
import styled, { keyframes } from 'styled-components'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 24px;
  margin-top: -2rem;
  width: 100%;
  max-width: none;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.colors.text2};
  background: transparent;
  border-top: none;
  box-shadow: none;
  z-index: -1;
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};

  opacity: ${({ show }) => (show ? 1 : 0)};
  animation: ${({ show }) => (show ? fadeIn : fadeOut)} 400ms ease-in-out;
  transition: opacity 400ms ease-in-out;
`

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade} />
    </AdvancedDetailsFooter>
  )
}
