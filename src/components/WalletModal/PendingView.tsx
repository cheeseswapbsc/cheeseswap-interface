import React from 'react'
import styled from 'styled-components'
import Option from './Option'
import { SUPPORTED_WALLETS } from '../../constants'
import { darken } from 'polished'
import Loader from '../Loader'
import { WalletType } from '../../global.d'

const PendingSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  width: 100%;
  & > * {
    width: 100%;
  }
`

const StyledLoader = styled(Loader)`
  margin-right: 1rem;
`

const LoadingMessage = styled.div<{ error?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
  border-radius: 14px;
  margin-bottom: 12px;
  padding: 0.25rem;
  color: ${({ theme, error }) => (error ? theme.colors.red1 : 'inherit')};
  background: ${({ theme, error }) =>
    error ? 'rgba(255, 82, 82, 0.08)' : `${theme.colors.primary1}10`};
  border: 1px solid ${({ theme, error }) =>
    error ? theme.colors.red1 : `${theme.colors.primary1}55`};

  & > * {
    padding: 1rem;
  }
`

const ErrorGroup = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
`

const ErrorButton = styled.div`
  border-radius: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text1};
  background-color: ${({ theme }) => theme.colors.bg4};
  margin-left: 1rem;
  padding: 0.5rem;
  font-weight: 600;
  user-select: none;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => darken(0.1, theme.colors.text4)};
  }
`

const LoadingWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: center;
`

export default function PendingView({
  walletType,
  walletName,
  walletIcon,
  error = false,
  setPendingError,
  tryActivation
}: {
  walletType?: WalletType
  walletName?: string
  walletIcon?: string
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (walletType?: WalletType) => void
}) {
  const isMetamask = window?.ethereum?.isMetaMask

  return (
    <PendingSection>
      <LoadingMessage error={error}>
        <LoadingWrapper>
          {error ? (
            <ErrorGroup>
              <div>Error connecting.</div>
              <ErrorButton
                onClick={() => {
                  setPendingError(false)
                  walletType && tryActivation(walletType)
                }}
              >
                Try Again
              </ErrorButton>
            </ErrorGroup>
          ) : (
            <>
              <StyledLoader />
              <div>
                <strong style={{ display: 'block' }}>Confirm in your wallet</strong>
                <span style={{ display: 'block', opacity: 0.72, fontSize: '0.75rem', marginTop: 2 }}>
                  Accept the connection request to continue
                </span>
              </div>
            </>
          )}
        </LoadingWrapper>
      </LoadingMessage>
      {walletIcon && walletName ? (
        // Modern path: show the exact EIP-6963 wallet being connected
        <Option
          id={`connect-pending-${walletName}`}
          clickable={false}
          color={'#666'}
          header={walletName}
          subheader={'Waiting for wallet confirmation...'}
          icon={walletIcon}
        />
      ) : (
        Object.keys(SUPPORTED_WALLETS).map(key => {
        const option = SUPPORTED_WALLETS[key]
        if (option.walletType === walletType) {
          if (walletType === 'METAMASK' || walletType === 'TRUST_WALLET' || walletType === 'OKX_WALLET' || walletType === 'FANTOM_WALLET') {
            if (isMetamask && option.name !== 'MetaMask') {
              return null
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null
            }
          }
          return (
            <Option
              id={`connect-${key}`}
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              icon={require('../../assets/images/' + option.iconName)}
            />
          )
        }
          return null
        })
      )}
    </PendingSection>
  )
}
