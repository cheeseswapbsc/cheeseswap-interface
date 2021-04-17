/*eslint-disable*/

import React from 'react'
import styled from 'styled-components'
import TranslatedText from '../TranslatedText'
import FarmMenu from '../FarmMenu'
//import Pool from '../../pages/Pool'
//import { Route } from 'react-router-dom'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledAbsoluteLink href="/">
        <TranslatedText translationId={2}>Swap</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://bscindex.com/#exchange" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>Exchange</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink>
        <FarmMenu />
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://keep3rb.network" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>Keeper</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://pizzafinance.app/#/ido" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>IDO</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://ogeeswap.com" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>HECO</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://info.cheeseswap.app" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={14}>Chart&nbsp;📈</TranslatedText>
      </StyledAbsoluteLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  font-size: 18px;
  padding-left: 5%;
  line-height: 45px;
  font-weight: 800;
  font-size: 16px;
  @media (max-width: 960px) {
    display: none;
   }
`

const StyledAbsoluteLink = styled.a`
  align-items: center;
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
  @media (max-width: 960px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`

export default Nav
