import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Option from './Option'
import { SUPPORTED_WALLETS } from '../../constants'
import { darken } from 'polished'
import Loader from '../Loader'
import { WalletType } from '../../global.d'
import { walletConnectConnector } from '../../connectors/WalletConnectProvider'
import { walletIcon as getWalletIcon } from '../../utils/walletIcon'
import QRCode from 'qrcode'

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

const QrWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 12px;
  padding: 0.75rem;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.bg3};

  img {
    width: 200px;
    height: 200px;
  }

  span {
    color: #15161b;
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
  }
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
  const [wcUri, setWcUri] = useState<string | null>(null)
  const [wcQr, setWcQr] = useState<string | null>(null)

  // WalletConnect pairing URI -> in-app QR code (fallback when the
  // built-in modal can't render, e.g. blocked domains or shadow-DOM issues)
  useEffect(() => {
    if (walletType !== 'WALLETCONNECT') return
    const unsubscribe = walletConnectConnector.onDisplayUri(setWcUri)
    return unsubscribe
  }, [walletType])

  useEffect(() => {
    if (!wcUri) return
    QRCode.toDataURL(wcUri, { width: 400, margin: 1 })
      .then(setWcQr)
      .catch(() => setWcQr(null))
  }, [wcUri])

  return (
    <PendingSection>
      {!error && walletType === 'WALLETCONNECT' && wcQr && (
        <QrWrapper>
          <img src={wcQr} alt="WalletConnect QR code" />
          <span>Scan with a WalletConnect-compatible wallet</span>
        </QrWrapper>
      )}
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
              icon={getWalletIcon(option.iconName)}
            />
          )
        }
          return null
        })
      )}
    </PendingSection>
  )
}
