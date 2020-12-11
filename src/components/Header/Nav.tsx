/*eslint-disable*/

import React from 'react'
import styled from 'styled-components'
import TranslatedText from '../TranslatedText'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledAbsoluteLink href="https://keep3rb.network" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>KP3RB</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://cheese.cheesemaker.farm" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={2}>Cheese Farm</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://stake.cheesemaker.farm" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={14}>Stake</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://dice4cheese.com" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={2}>Dice</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://voting.cheesemaker.farm" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={12}>Voting</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://info.cheeseswap.app" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={14}>Analytics</TranslatedText>
      </StyledAbsoluteLink>
     <StyledAbsoluteLink href="https://www.binance.org/en/panama" target="_blank" rel="noopener noreferrer">
     <TranslatedText translationId={10}>ERC20 Bridge</TranslatedText>
     </StyledAbsoluteLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  font-size: 16px;
  line-height: 45px;
  font-weight: 700;
  @media (max-width: 600px) {
    display: none;

  }
`

const StyledAbsoluteLink = styled.a`
  color: #919091;
  padding-left: 10px;
  padding-right: 10px;
  text-decoration: none;
  &:hover {
    color: #b5449b;
  }
  &.active {
    color: #b5449b;
  }
  @media (max-width: 400px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`

export default Nav
