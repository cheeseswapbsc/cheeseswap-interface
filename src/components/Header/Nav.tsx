/*eslint-disable*/

import React from 'react'
import styled from 'styled-components'
import TranslatedText from '../TranslatedText'
// import FarmMenu from '../FarmMenu'
// import Pool from '../../pages/Pool'
// import { Route } from 'react-router-dom'

const Nav: React.FC = () => {
  return (
    <StyledNav>
        <StyledAbsoluteLink href="https://pizza.cheeseswap.app" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>Pizza Farm&nbsp;</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://kiwi.cheeseswap.app" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>Kiwi Farm&nbsp;</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://mango.cheeseswap.app" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={14}>Mango Farm&nbsp;</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://hots.cheeseswap.app" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>HOTS Farm&nbsp;</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://cnft.cheeseswap.app" target="_blank" rel="noopener noreferrer">
        <TranslatedText translationId={10}>CNFT Farm&nbsp;</TranslatedText>
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
