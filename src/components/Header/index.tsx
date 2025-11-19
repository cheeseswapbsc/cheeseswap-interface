import { ChainId } from '@cheeseswapv2/sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'

import Logow from '../../assets/images/cheeseswap-logo.png'
import Logob from '../../assets/images/cheeseswap-logo.png'

import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { YellowCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'
import Nav from './Nav'
import ThemeSwitch from './ThemeSwitch'
import { useIsDarkMode } from '../../state/user/hooks'

import { RowBetween } from '../Row'
import Web3Status from '../Web3Status'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 16px;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.colors.bg1};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  top: 0;
  padding: 1.25rem 1.5rem;
  margin-bottom: 16px;
  position: absolute;
  z-index: 10;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    box-shadow: 0 6px 32px rgba(0, 0, 0, 0.12);
  }
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0.75rem 1rem;
    width: calc(100%);
    position: relative;
    border-radius: 12px;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    gap: 0.25rem;
  `};
  
  @media (max-width: 400px) {
    flex-shrink: 1;
    min-width: 0;
  }
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${({ theme, active }) => (!active ? theme.colors.bg2 : theme.colors.bg3)};
  border: 1px solid ${({ theme, active }) => (!active ? 'transparent' : theme.colors.primary1)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  padding: 4px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary1};
    background: ${({ theme }) => theme.colors.bg3};
  }

  :focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary1};
    outline-offset: 2px;
  }
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 2px;
    border-radius: 8px;
  `};
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const CheeseIcon = styled.div`
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  
  :hover {
    transform: scale(1.05) rotate(-3deg);
  }
  
  img {
    height: 3.5rem;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
  }
  
  ${({ theme }) => theme.mediaWidth.upToMedium`
    img {
      height: 3rem;
    }
  `};
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img {
      height: 2.5rem;
    }
  `};
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    img {
      height: 2rem;
    }
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 1;
  min-width: 0;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  `};
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    gap: 0.25rem;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.BSCTESTNET]: 'Bsc-testnet'
}

export default function Header() {
  const isDark = useIsDarkMode()
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }}>
        <HeaderElement>
          <Title href="/">
            <CheeseIcon>
              { !isDark?
                <img src={Logob} alt="logo" />
                :
                <img src={Logow} alt="logo" />
              }
            </CheeseIcon>
          </Title>
        </HeaderElement>

        <Nav />
        <HeaderControls>
          {!isMobile && <ThemeSwitch />}
          <HeaderElement>
            <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={700}>
                  {userEthBalance?.toSignificant(4)} BNB
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            {isMobile && <ThemeSwitch />}
            <Settings />
            <Menu />
          </HeaderElementWrap>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
