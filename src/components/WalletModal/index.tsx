import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import styled, { keyframes } from 'styled-components'
import { isMobile } from 'react-device-detect'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import usePrevious from '../../hooks/usePrevious'
import { useWalletModalOpen, useWalletModalToggle } from '../../state/application/hooks'

import Modal from '../Modal'
import AccountDetails from '../AccountDetails'
import PendingView from './PendingView'
import Option from './Option'
import { SUPPORTED_WALLETS } from '../../constants'
import { ExternalLink } from '../Shared'
import MetamaskIcon from '../../assets/images/metamask.png'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { injected } from '../../connectors'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'

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
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error } = useWeb3React()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

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
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name
    })
    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    connector &&
      activate(connector, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector) // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true)
        }
      })
  }



  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]
      // check for mobile options
      if (isMobile) {
          if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                option.connector !== connector && !option.href && tryActivation(option.connector)
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
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

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
              />
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={require('../../assets/images/' + option.iconName)}
          />
        )
      )
    })
  }

  function getModalContent() {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>{error instanceof UnsupportedChainIdError ? '⚠️ Wrong Network' : '⚠️ Connection Error'}</HeaderRow>
          <ContentWrapper>
            {error instanceof UnsupportedChainIdError ? (
              <ErrorMessage>
                <h5>
                  Please connect to the Binance Smart Chain network.
                  <a href="https://docs.binance.org/smart-chain/wallet/metamask.html" target="_blank" rel="noopener noreferrer">
                    Learn how
                  </a>
                </h5>
              </ErrorMessage>
            ) : (
              <ErrorMessage>
                Unable to connect to your wallet. Please try refreshing the page or check your wallet extension.
              </ErrorMessage>
            )}
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
              connector={pendingWallet}
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
