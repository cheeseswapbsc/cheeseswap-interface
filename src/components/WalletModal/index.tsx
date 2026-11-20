import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import styled, { keyframes } from 'styled-components'
import usePrevious from '../../hooks/usePrevious'
import { useWalletModalOpen, useWalletModalToggle } from '../../state/application/hooks'

import Modal from '../Modal'
import AccountDetails from '../AccountDetails'
import PendingView from './PendingView'
import Option from './Option'
import { SUPPORTED_WALLETS, WalletType } from '../../connectors/utils'
import { ExternalLink } from '../Shared'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { useWeb3, rdnsToWalletType } from '../../providers/Web3Provider'

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
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 0 3.25rem 0 1.25rem;
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.025em;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.colors.primary1 : ({ theme }) => theme.colors.text1)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.bg3}40;
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem 1rem 0.75rem 1rem;
    font-size: 0.9375rem;
  `};
`

const ContentWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bg1};
  padding: 1rem 1.25rem 1.25rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  max-height: calc(68vh - 64px);
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
  grid-gap: 0.625rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-gap: 0.625rem;
  `};
`

const WalletIntro = styled.div`
  margin: 0 0 0.875rem;
  text-align: center;

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text1};
    font-size: 0.9375rem;
    font-weight: 600;
  }

  span {
    display: block;
    margin-top: 0.25rem;
    color: ${({ theme }) => theme.colors.text3};
    font-size: 0.75rem;
  }
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

const RefreshButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary1};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary2};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
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
  const { account, connect, isConnected, error, walletType, walletMeta, discoveredWallets } = useWeb3()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingWallet, setPendingWallet] = useState<
    { walletType: WalletType; rdns?: string; name: string; icon?: string } | undefined
  >()

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

  const tryActivation = async (walletTypeToConnect: WalletType, rdns?: string, name?: string, icon?: string) => {
    const wallet = Object.values(SUPPORTED_WALLETS).find(w => w.type === walletTypeToConnect)
    const displayName = name || wallet?.name || 'Unknown'

    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: displayName
    })

    setPendingWallet({ walletType: walletTypeToConnect, rdns, name: displayName, icon })
    setWalletView(WALLET_VIEWS.PENDING)

    try {
      await connect(walletTypeToConnect, rdns)
    } catch (err) {
      console.error('Connection error:', err)
      setPendingError(true)
    }
  }

  const handleRefresh = async () => {
    // Try to reconnect with the injected connector as fallback
    try {
      await connect('INJECTED')
    } catch (err) {
      console.error('Refresh connection error:', err)
      // Error will be shown again through the context
    }
  }

  // get wallets user can switch to - EIP-6963 discovered wallets first, then fallbacks
  function getOptions() {
    const options: React.ReactNode[] = []
    const discoveredRdns = new Set(discoveredWallets.map(w => w.info.rdns))

    // 1. Modern path: wallets that announced themselves via EIP-6963
    discoveredWallets.forEach(detail => {
      const mappedType = rdnsToWalletType(detail.info.rdns)
      const isActive = !!account && walletMeta?.rdns === detail.info.rdns
      options.push(
        <Option
          key={`eip6963-${detail.info.rdns}`}
          id={`connect-${detail.info.rdns}`}
          onClick={() => tryActivation(mappedType, detail.info.rdns, detail.info.name, detail.info.icon)}
          active={isActive}
          color={SUPPORTED_WALLETS[mappedType]?.color || '#666'}
          header={detail.info.name}
          subheader={null}
          icon={detail.info.icon}
          clickable={!isActive}
          statusLabel="Detected"
          tooltip={`Connect with the ${detail.info.name} extension (detected in this browser).`}
        />
      )
    })

    // 2. Legacy injected fallback when nothing announced itself but window.ethereum exists
    const hasLegacyInjected = typeof window !== 'undefined' && Boolean((window as any).ethereum)
    if (discoveredWallets.length === 0 && hasLegacyInjected) {
      const info = SUPPORTED_WALLETS.INJECTED
      if (info) {
        options.push(
          <Option
            key="INJECTED"
            id="connect-INJECTED"
            onClick={() => tryActivation('INJECTED')}
            active={!!account && walletType === 'INJECTED' && !walletMeta?.rdns}
            color={info.color}
            header="Browser Wallet"
            subheader={null}
            icon={require('../../assets/images/' + info.iconName)}
            clickable={true}
            statusLabel="Detected"
            tooltip="Connect with the wallet injected into this browser."
          />
        )
      }
    }

    // 3. Binance Chain Wallet (legacy window.BinanceChain injection, no EIP-6963 support)
    if (!discoveredRdns.has('com.binance.wallet') && typeof window !== 'undefined' && (window as any).BinanceChain) {
      const info = SUPPORTED_WALLETS.BINANCE
      if (info) {
        options.push(
          <Option
            key="BINANCE"
            id="connect-BINANCE"
            onClick={() => tryActivation('BINANCE')}
            active={!!account && walletType === 'BINANCE'}
            color={info.color}
            header={info.name}
            subheader={null}
            icon={require('../../assets/images/' + info.iconName)}
            clickable={walletType !== 'BINANCE'}
            statusLabel="Detected"
            tooltip="Binance Chain Wallet extension."
          />
        )
      }
    }

    // 4. WalletConnect - connects any mobile wallet by QR code / deep link
    const wcInfo = SUPPORTED_WALLETS.WALLETCONNECT
    if (wcInfo) {
      options.push(
        <Option
          key="WALLETCONNECT"
          id="connect-WALLETCONNECT"
          onClick={() => tryActivation('WALLETCONNECT')}
          active={!!account && walletType === 'WALLETCONNECT'}
          color={wcInfo.color}
          header={wcInfo.name}
          subheader={null}
          icon={require('../../assets/images/' + wcInfo.iconName)}
          clickable={walletType !== 'WALLETCONNECT'}
          statusLabel="QR code / mobile"
          tooltip="Scan a QR code with any WalletConnect-compatible mobile wallet."
        />
      )
    }

    // 5. Coinbase Wallet SDK (when the extension didn't announce itself)
    if (!discoveredRdns.has('com.coinbase.wallet')) {
      const cbInfo = SUPPORTED_WALLETS.COINBASE
      if (cbInfo) {
        options.push(
          <Option
            key="COINBASE"
            id="connect-COINBASE"
            onClick={() => tryActivation('COINBASE')}
            active={!!account && walletType === 'COINBASE'}
            color={cbInfo.color}
            header={cbInfo.name}
            subheader={null}
            icon={require('../../assets/images/' + cbInfo.iconName)}
            clickable={walletType !== 'COINBASE'}
            statusLabel="App / extension"
            tooltip="Connect with the Coinbase Wallet app or extension."
          />
        )
      }
    }

    // 6. Nothing installed at all: point the user to MetaMask
    if (discoveredWallets.length === 0 && !hasLegacyInjected) {
      const mmInfo = SUPPORTED_WALLETS.METAMASK
      if (mmInfo) {
        options.push(
          <Option
            key="install-metamask"
            id="install-metamask"
            link="https://metamask.io/download/"
            color={mmInfo.color}
            header="Install MetaMask"
            subheader={null}
            icon={require('../../assets/images/' + mmInfo.iconName)}
            statusLabel="Not installed"
            tooltip="No browser wallet detected. Install MetaMask to get started."
          />
        )
      }
    }

    return options
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
            <RefreshButton onClick={handleRefresh}>
              <span role="img" aria-label="refresh">🔄</span> Try Again
            </RefreshButton>
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
              walletType={pendingWallet?.walletType}
              walletName={pendingWallet?.name}
              walletIcon={pendingWallet?.icon}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={() =>
                pendingWallet &&
                tryActivation(pendingWallet.walletType, pendingWallet.rdns, pendingWallet.name, pendingWallet.icon)
              }
            />
          ) : (
            <>
              <WalletIntro>
                <strong>Choose a wallet</strong>
                <span>Connect securely to start using CheeseSwap</span>
              </WalletIntro>
              <OptionGrid>{getOptions()}</OptionGrid>
            </>
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
