import React from 'react'
import styled from 'styled-components'
import TranslatedText from '../TranslatedText'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledAbsoluteLink href="https://cheesemaker.farm/farms">
        <TranslatedText translationId={2}>Farm</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://swap.cheesemaker.farm/" className="active">
        <TranslatedText translationId={8}>Exchange</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://stake.cheesemaker.farm">
        <TranslatedText translationId={14}>Stake</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://voting.cheesemaker.farm">
        <TranslatedText translationId={12}>Voting</TranslatedText>
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="https://info.cheesemaker.farm">
        <TranslatedText translationId={14}>Analytics</TranslatedText>
      </StyledAbsoluteLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  font-size: 20px;
  line-height: 45px;
  font-weight: 500;
  @media (max-width: 600px) {
    display: none;
  }
`

const StyledAbsoluteLink = styled.a`
  color: #e5af17;
  padding-left: 10px;
  padding-right: 10px;
  text-decoration: none;
  &:hover {
    color: #c18e00;
  }
  &.active {
    color: #c18e00;
  }
  @media (max-width: 400px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`

export default Nav
