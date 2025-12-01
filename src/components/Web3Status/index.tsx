import React, { useMemo } from 'react'
import { Activity, LogOut, Copy } from 'react-feather'
import styled, { css } from 'styled-components'
import { darken, lighten } from 'polished'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import MetaMaskIcon from '../../assets/images/metamask.png'
import TrustWalletIcon from '../../assets/images/trustWallet.png'
import OkxWalletIcon from '../../assets/images/okxWallet.png'
import FantomWalletIcon from '../../assets/images/fantomWallet.png'
import { CHAIN_ID, NETWORK_NAME } from '../../connectors'
import { useState } from 'react'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'
import Loader from '../Loader'
import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'
import { useWeb3 } from '../../providers/Web3Provider'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? `${size}px` : '32px')};
    width: ${({ size }) => (size ? `${size}px` : '32px')};
  }
`

const LogoutButton = styled.div`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text1};
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: ${({ theme }) => theme.colors.red1};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 6px;
    svg {
      width: 14px;
      height: 14px;
    }
  `};
`

const WalletWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
  
  @media (max-width: 600px) {
    padding: 0.4rem;
    border-radius: 10px;
  }
  
  @media (max-width: 400px) {
    padding: 0.3rem;
    border-radius: 8px;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.colors.red1};
  border: 2px solid ${({ theme }) => theme.colors.red1};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.colors.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.colors.primary4};
  border: none;
  color: ${({ theme }) => theme.colors.primaryText1};
  font-weight: 700;

  :hover,
  :focus {
    border: 2px solid ${({ theme }) => darken(0.05, theme.colors.primary4)};
    color: ${({ theme }) => theme.colors.primaryText1};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${({ theme }) => theme.colors.primary5};
      border: 2px solid ${({ theme }) => theme.colors.primary5};
      color: ${({ theme }) => theme.colors.primaryText1};

      :hover,
      :focus {
        border: 2px solid ${({ theme }) => darken(0.05, theme.colors.primary4)};
        color: ${({ theme }) => darken(0.05, theme.colors.primaryText1)};
      }
    `}
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ pending, theme }) => (pending ? theme.colors.primary1 : theme.colors.bg2)};
  border: 2px solid ${({ pending, theme }) => (pending ? theme.colors.primary1 : theme.colors.bg3)};
  color: ${({ pending, theme }) => (pending ? theme.colors.white : theme.colors.text1)};
  font-weight: 700;
  :hover,
  :focus {
    background-color: ${({ pending, theme }) =>
      pending ? darken(0.05, theme.colors.primary1) : lighten(0.05, theme.colors.bg2)};

    :focus {
      border: 2px solid
        ${({ pending, theme }) => (pending ? darken(0.1, theme.colors.primary1) : darken(0.1, theme.colors.bg3))};
    }
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 700;
  
  @media (max-width: 600px) {
    font-size: 0.875rem;
    margin: 0 0.25rem 0 0.15rem;
  }
  
  @media (max-width: 400px) {
    font-size: 0.75rem;
    margin: 0 0.15rem 0 0.1rem;
  }
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const SOCK = (
  <span role="img" aria-label="has socks emoji" style={{ marginTop: -4, marginBottom: -4 }}>
    🧦
  </span>
)

// eslint-disable-next-line react/prop-types
function StatusIcon({ walletType }: { walletType: string | null }) {
  if (walletType === 'METAMASK') {
    return (
      <IconWrapper size={16}>
        <img src={MetaMaskIcon} alt={'MetaMask logo'} />
      </IconWrapper>
    )
  } else if (walletType === 'TRUST_WALLET') {
    return (
      <IconWrapper size={16}>
        <img src={TrustWalletIcon} alt={'Trust Wallet logo'} />
      </IconWrapper>
    )
  } else if (walletType === 'OKX_WALLET') {
    return (
      <IconWrapper size={16}>
        <img src={OkxWalletIcon} alt={'OKX Wallet logo'} />
      </IconWrapper>
    )
  } else if (walletType === 'FANTOM_WALLET') {
    return (
      <IconWrapper size={16}>
        <img src={FantomWalletIcon} alt={'Fantom Wallet logo'} />
      </IconWrapper>
    )
  } else if (walletType === 'WALLETCONNECT') {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={'WalletConnect logo'} />
      </IconWrapper>
    )
  } else if (walletType === 'COINBASE') {
    return (
      <IconWrapper size={16}>
        <img src={CoinbaseWalletIcon} alt={'Coinbase Wallet logo'} />
      </IconWrapper>
    )
  }
  return null
}

function Web3StatusInner() {
  const { account, walletType, error, chainId, disconnect } = useWeb3()
  const { ENSName } = useENSName(account ?? undefined)
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()
  const [copied, setCopied] = useState(false)
  // Check if wrong network
  const isWrongNetwork = chainId && chainId !== CHAIN_ID

  const handleDisconnect = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await disconnect()
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (account) {
      navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }

  if (account) {
    return (
      <WalletWrapper>
        <Web3StatusConnected id="web3-status-connected" onClick={toggleWalletModal} pending={hasPendingTransactions} style={{ transition: 'background 0.3s, color 0.3s' }}>
          {hasPendingTransactions ? (
            <RowBetween>
              <Text>{pending?.length} Pending</Text> <Loader stroke="white" />
            </RowBetween>
          ) : (
            <>
              {hasSocks ? SOCK : null}
              <Text>{ENSName || shortenAddress(account)}</Text>
              <span style={{ marginLeft: 8, cursor: 'pointer' }} title={copied ? 'Copied!' : 'Copy Address'} onClick={handleCopy}>
                <Copy size={16} color={copied ? '#4caf50' : '#888'} />
              </span>
              <span style={{ marginLeft: 12, fontSize: '0.9em', color: '#888', display: 'flex', alignItems: 'center' }}>
                <Activity size={14} style={{ marginRight: 4 }} />
                {chainId === CHAIN_ID ? NETWORK_NAME : `Unknown Network (${chainId})`}
              </span>
            </>
          )}
          {!hasPendingTransactions && walletType && <StatusIcon walletType={walletType} />}
        </Web3StatusConnected>
        <LogoutButton onClick={handleDisconnect} title="Disconnect Wallet">
          <LogOut />
        </LogoutButton>
      </WalletWrapper>
    )
  } else if (error || isWrongNetwork) {
    return (
      <Web3StatusError onClick={toggleWalletModal} style={{ animation: 'fadein 0.3s' }}>
        <NetworkIcon />
        <Text>{isWrongNetwork ? 'Wrong Network' : 'Error'}</Text>
        {isWrongNetwork && (
          <span style={{ marginLeft: 8, color: '#e53935', fontWeight: 500 }}>
            Please connect to {NETWORK_NAME}
          </span>
        )}
      </Web3StatusError>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account} style={{ animation: 'fadein 0.3s' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
        </svg>
        <Text>Connect Wallet</Text>
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  const { account } = useWeb3()

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
