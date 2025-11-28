import React, { useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { AppDispatch } from '../../state'
import { clearAllTransactions } from '../../state/transactions/actions'
import { shortenAddress, getBscscanLink } from '../../utils'
import { AutoRow } from '../Row'
import Copy from './Copy'
import Transaction from './Transaction'
import { SUPPORTED_WALLETS } from '../../constants'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import MetaMaskIcon from '../../assets/images/metamask.png'
import TrustWalletIcon from '../../assets/images/trustWallet.png'
import OkxWalletIcon from '../../assets/images/okxWallet.png'
import FantomWalletIcon from '../../assets/images/fantomWallet.png'
import { ButtonSecondary } from '../Button'
import { ExternalLink as LinkIcon } from 'react-feather'
import { ExternalLink, LinkStyledButton, TYPE } from '../Shared'
import { useWeb3 } from '../../providers/Web3Provider'

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 700;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.colors.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 700;
  }
`

const InfoCard = styled.div`
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  background-color: ${({ theme }) => theme.colors.bg1};
  padding: 0rem 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 600;
  }

  h4 {
    margin: 0;
    font-weight: 700;
  }
`

const LowerSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  padding: 1.5rem;
  flex-grow: 1;
  overflow: auto;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 20px;

  h5 {
    margin: 0;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text3};
  }
`

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 700;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const AddressLink = styled(ExternalLink)<{ hasENS: boolean; isENS: boolean }>`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.colors.text2};
  }
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.colors.text4};
  }
`

const WalletName = styled.div`
  width: initial;
  font-size: 0.825rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text3};
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`

const WalletAction = styled(ButtonSecondary)`
  width: fit-content;
  font-weight: 600;
  margin-left: 8px;
  font-size: 0.825rem;
  padding: 4px 6px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`
/*
const MainWalletAction = styled(WalletAction)`
  color: ${({ theme }) => theme.colors.primary1};
`
*/

function renderTransactions(transactions: string[]) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </TransactionListWrapper>
  )
}

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions
}: AccountDetailsProps) {
  const { chainId, account } = useActiveWeb3React()
  const { walletType, disconnect } = useWeb3()
  const theme = useContext(ThemeContext)
  const dispatch = useDispatch<AppDispatch>()

  function formatConnectorName() {
    const wallet = Object.values(SUPPORTED_WALLETS).find(w => w.walletType === walletType)
    const name = wallet?.name || 'Unknown'
    return <WalletName>Connected with {name}</WalletName>
  }

  function getStatusIcon() {
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

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <>
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>Account</HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                {formatConnectorName()}
                <div>
                  {walletType === 'WALLETCONNECT' && (
                    <WalletAction
                      style={{ fontSize: '.825rem', fontWeight: 600, marginRight: '8px' }}
                      onClick={() => {
                        disconnect()
                      }}
                    >
                      Disconnect
                    </WalletAction>
                  )}
                  <WalletAction
                    style={{ fontSize: '.825rem', fontWeight: 600 }}
                    onClick={() => {
                      openOptions()
                    }}
                  >
                    Change
                  </WalletAction>
                </div>
              </AccountGroupingRow>
              <AccountGroupingRow id="web3-account-identifier-row">
                <AccountControl>
                  {ENSName ? (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {ENSName}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {account && shortenAddress(account)}</p>
                      </div>
                    </>
                  )}
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                {ENSName ? (
                  <>
                    <AccountControl>
                      <div>
                        {account && (
                          <Copy toCopy={account}>
                            <span style={{ marginLeft: '4px' }}>Copy Address</span>
                          </Copy>
                        )}
                        {chainId && account && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={true}
                            href={chainId && getBscscanLink(chainId, ENSName, 'address')}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>View on bscscan</span>
                          </AddressLink>
                        )}
                      </div>
                    </AccountControl>
                  </>
                ) : (
                  <>
                    <AccountControl>
                      <div>
                        {account && (
                          <Copy toCopy={account}>
                            <span style={{ marginLeft: '4px' }}>Copy Address</span>
                          </Copy>
                        )}
                        {chainId && account && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={false}
                            href={getBscscanLink(chainId, account, 'address')}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>View on bscscan</span>
                          </AddressLink>
                        )}
                      </div>
                    </AccountControl>
                  </>
                )}
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <LowerSection>
          <AutoRow mb={'1rem'} style={{ justifyContent: 'space-between' }}>
            <TYPE.body>Recent Transactions</TYPE.body>
            <LinkStyledButton onClick={clearAllTransactionsCallback}>(clear all)</LinkStyledButton>
          </AutoRow>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </LowerSection>
      ) : (
        <LowerSection>
          <TYPE.body color={theme.colors.text1}>Your transactions will appear here...</TYPE.body>
        </LowerSection>
      )}
    </>
  )
}
