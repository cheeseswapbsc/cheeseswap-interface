import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import styled, { keyframes } from 'styled-components'
import { isMobile } from 'react-device-detect'
import usePrevious from '../../hooks/usePrevious'
import { useWalletModalOpen, useWalletModalToggle } from '../../state/application/hooks'

import Modal from '../Modal'
import AccountDetails from '../AccountDetails'
import PendingView from './PendingView'
import Option from './Option'
import { SUPPORTED_WALLETS } from '../../constants'
import { ExternalLink } from '../Shared'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { useWeb3 } from '../../providers/Web3Provider'
import { WalletType } from '../../connectors/utils'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.08);
    transform: rotate(90deg);
  }
  
  &:active {
    transform: rotate(90deg) scale(0.9);
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.colors.text2};
    stroke-width: 2;
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 100%;
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1.25rem 1.25rem 0.875rem 1.25rem;
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: -0.02em;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.colors.primary1 : ({ theme }) => theme.colors.text1)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.bg3}40;
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem 1rem 0.75rem 1rem;
    font-size: 0.9375rem;
  `};
`

const ContentWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bg1};
  padding: 1.25rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  max-height: calc(68vh - 180px);
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Hidden scrollbar for modern browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem;
    max-height: calc(59.5vh - 140px);
  `};
`

const UpperSection = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.bg1};
  border-radius: 20px;
  overflow: hidden;

  h5 {
    margin: 0;
    margin-bottom: 0.625rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text1};
    
    a {
      color: ${({ theme }) => theme.colors.primary1};
      text-decoration: none;
      margin-left: 0.375rem;
      font-weight: 500;
      transition: opacity 0.2s ease;
      
      &:hover {
        opacity: 0.8;
        text-decoration: underline;
      }
    }
  }

  h5:last-child {
    margin-bottom: 0;
  }

  h4 {
    margin: 0 0 0.75rem 0;
    font-weight: 500;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text1};
  }
`

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.bg3}40;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text3};
  font-weight: 400;
  
  span {
    color: ${({ theme }) => theme.colors.text3};
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary1};
    font-weight: 500;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-top: 1rem;
    padding-top: 1rem;
    font-size: 0.75rem;
  `};
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr;
  
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-gap: 0.5rem;
  `};
`

const HoverText = styled.div`
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.9375rem;
  
  &:hover {
    cursor: pointer;
    opacity: 0.7;
    transform: translateX(-2px);
  }
  
  &::before {
    content: '←';
    margin-right: 0.375rem;
    font-size: 1rem;
    transition: transform 0.2s ease;
  }
  
  &:hover::before {
    transform: translateX(-2px);
  }
`

const ErrorMessage = styled.div`
  padding: 0.875rem;
  border-radius: 10px;
  background-color: rgba(255, 82, 82, 0.08);
  border: 1px solid rgba(255, 82, 82, 0.25);
  color: ${({ theme }) => theme.colors.red1};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: 0.75rem;
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  // Use new Web3 context
  const { account, connect, isConnected, error, walletType } = useWeb3()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingWallet, setPendingWallet] = useState<WalletType | undefined>()

  const [pendingError, setPendingError] = useState<boolean>()

  const walletModalOpen = useWalletModalOpen()
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(isConnected)
  const walletTypePrevious = usePrevious(walletType)
  useEffect(() => {
    if (walletModalOpen && ((isConnected && !activePrevious) || (walletType && walletType !== walletTypePrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, isConnected, error, walletType, walletModalOpen, activePrevious, walletTypePrevious])

  const tryActivation = async (walletTypeToConnect: WalletType) => {
    const wallet = Object.values(SUPPORTED_WALLETS).find(w => w.walletType === walletTypeToConnect)
    const name = wallet?.name || 'Unknown'

    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name
    })

    setPendingWallet(walletTypeToConnect)
    setWalletView(WALLET_VIEWS.PENDING)

    try {
      await connect(walletTypeToConnect)
    } catch (err) {
      console.error('Connection error:', err)
      setPendingError(true)
    }
  }

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]

      // check for mobile options
      if (isMobile) {
        if (!window.web3 && !window.ethereum && (option.walletType === 'WALLETCONNECT' || option.walletType === 'COINBASE')) {
          return (
            <Option
              onClick={() => {
                tryActivation(option.walletType)
              }}
              id={`connect-${key}`}
              key={key}
              active={option.walletType === walletType}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={require('../../assets/images/' + option.iconName)}
            />
          )
        }
        return null
      }

      // Desktop: show all wallets
      if (!isMobile && !option.mobileOnly) {
        return (
          <Option
            id={`connect-${key}`}
            key={key}
            onClick={() => {
              option.walletType === walletType
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.walletType)
            }}
            active={option.walletType === walletType}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null}
            icon={require('../../assets/images/' + option.iconName)}
          />
        )
      }
      return null
    })
  }

  function getModalContent() {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow><span role="img" aria-label="warning">⚠️</span> Connection Error</HeaderRow>
          <ContentWrapper>
            <ErrorMessage>
              <h5>
                {error.includes('chain') || error.includes('network') 
                  ? 'Please connect to the BSC Mainnet network.'
                  : 'Unable to connect to your wallet. Please try refreshing the page or check your wallet extension.'}
              </h5>
              <a href="https://docs.bnbchain.org/docs/wallets/wallet-tutorial-overview" target="_blank" rel="noopener noreferrer">
                Learn how to connect
              </a>
            </ErrorMessage>
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow color="blue">
            <HoverText
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              Back
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            <span>Connect Wallet</span>
          </HeaderRow>
        )}
        <ContentWrapper>
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              walletType={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <OptionGrid>{getOptions()}</OptionGrid>
          )}
          {walletView !== WALLET_VIEWS.PENDING && (
            <Blurb>
              <span>New to BSC? &nbsp;</span>{' '}
              <ExternalLink href="https://docs.binance.org/smart-chain/wallet/metamask.html">
                Learn more about wallets
              </ExternalLink>
            </Blurb>
          )}
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}
