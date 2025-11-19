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
  font-size: 16px;
  padding-left: 2%;
  line-height: 45px;
  font-weight: 800;
  gap: 0.25rem;
  flex-shrink: 1;
  flex-wrap: nowrap;
  
  @media (max-width: 1280px) {
    font-size: 14px;
    padding-left: 1%;
    gap: 0;
  }
  
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
  white-space: nowrap;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text2};
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.text2};
  }
  
  @media (max-width: 1280px) {
    padding-left: 6px;
    padding-right: 6px;
    font-size: 0.9em;
  }
  
  @media (max-width: 1100px) {
    padding-left: 4px;
    padding-right: 4px;
    font-size: 0.85em;
  }
`

export default Nav
