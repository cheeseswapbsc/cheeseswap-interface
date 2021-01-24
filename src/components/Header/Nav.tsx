/*eslint-disable*/

import React from 'react'
import styled from 'styled-components'
import TranslatedText from '../TranslatedText'
//import Pool from '../../pages/Pool'
//import { Route } from 'react-router-dom'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledAbsoluteLink href="/">
        <TranslatedText translationId={2}>Exchange</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="/pool#/pool">
        <TranslatedText translationId={2}>Pool</TranslatedText>
      </StyledAbsoluteLink>
      
      <StyledAbsoluteLink href="https://keep3rb.network" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>KP3RB</TranslatedText>
      </StyledAbsoluteLink>
       <StyledAbsoluteLink href="https://farm.cheeseswap.app" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>Farm</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://stake.cheeseswap.app" target="_blank" rel="noopener noreferrer">
       <TranslatedText translationId={14}>Stake</TranslatedText>
     </StyledAbsoluteLink>
      <StyledAbsoluteLink href="/" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={2}>NFT (Very Soon)</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://info.cheeseswap.app" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={14}>Chart</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://coinmarketcap.com/currencies/cheeseswap/" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={14}>CoinMarketCap</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://www.coingecko.com/en/coins/cheeseswap" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={14}>CoinGecko</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://api.cheeseswap.app" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={14}>API</TranslatedText>
      </StyledAbsoluteLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  font-size: 20px;
  line-height: 45px;
  font-weight: 700;
  @media (max-width: 600px) {
    display: none;

  }
`

const StyledAbsoluteLink = styled.a`
  color: ${({ theme }) => theme.colors.text1};
  padding-left: 10px;
  padding-right: 10px;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.colors.text2};
  }
  &.active {
    color: ${({ theme }) => theme.colors.text2};
  }
  @media (max-width: 400px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`

export default Nav
