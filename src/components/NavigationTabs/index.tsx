import React from 'react'
import styled from 'styled-components'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'
import TranslatedText from '../TranslatedText'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
  gap: 1rem;
  flex: 1;
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    gap: 0.5rem;
  `}
`

const activeClassName = 'ACTIVE'

const StyledAbsoluteLink = styled.a`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text1};
  font-size: 16px;
  padding: 0 0.75rem;
  background: ${({ theme }) => theme.colors.bg3};
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  white-space: nowrap;
  transition: all 0.2s;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &.${activeClassName} {
    background: ${({ theme }) => theme.colors.bg3};
    color: ${({ theme }) => theme.colors.primary1};
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
  }

  :hover {
    background: ${({ theme }) => theme.colors.bg3};
    color: ${({ theme }) => theme.colors.primary1};
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
    padding: 0 0.5rem;
  `}
`
const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text1};
  font-size: 16px;
  padding: 0 0.75rem;
  background: ${({ theme }) => theme.colors.bg3};
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  transition: all 0.2s;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &.${activeClassName} {
    background: ${({ theme }) => theme.colors.bg3};
    color: ${({ theme }) => theme.colors.primary1};
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
  }

  :hover,
  :focus {
    background: ${({ theme }) => theme.colors.bg3};
    color: ${({ theme }) => theme.colors.primary1};
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
    padding: 0 0.5rem;
  `}
`

const ActiveText = styled.div`
  font-weight: 700;
  font-size: 18px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.colors.text1};
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  return (
    <Tabs style={{ marginBottom: '10px' }}>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        <TranslatedText translationId={8}>Swap</TranslatedText>
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        <TranslatedText translationId={74}>Pool</TranslatedText>
      </StyledNavLink>
      <StyledAbsoluteLink id={`pool-nav-link`} target="_blank" href={'https://www.binance.org/en/bridge?utm_source=CheeseSwap'}>
          ERC20 Bridge
      </StyledAbsoluteLink>
    </Tabs>
  )
}

export function FindPoolTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
        <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{adding ? 'Add' : 'Remove'} Liquidity</ActiveText>
        <QuestionHelper
          text={
            adding
              ? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
              : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}
