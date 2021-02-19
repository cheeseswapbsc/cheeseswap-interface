import React from 'react'
import styled from 'styled-components'
import LogoH from '../../assets/images/cheeseswap-logo.png'
import Twitter from '../../assets/svg/twitter.svg'
import Telegram from '../../assets/svg/telegram.svg'
import Github from '../../assets/svg/github.svg'
import Mail from '../../assets/svg/email.svg'

const FooterSection = styled.div`
  background: ${({ theme }) => theme.colors.bg1};
  box-sizing: border-box;
  z-index: 1;
  margin: 0px;
  min-width: 0px;
  width: 100vw;
  display: flex;
  padding: 1rem;
  bottom: 0px;
  align-items: flex-start;
  justify-content: space-evenly;
  @media (max-width: 480px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`
const FooterWrapper = styled.div`
  padding: 12px;
`
const Title = styled.div`
  margin: 0 0 0 10px;
  font-weight: 700;
`
const Title2 = styled.div`
  margin: 0 0 0 10px;
  font-weight: 400;
`
const StyledAbsoluteLink = styled.a`
  color: ${({ theme }) => theme.colors.text1};
  display: flex;
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
const LogoTitle = styled.img`
  height: 54px;
`
const SocialSection = styled.div`
  margin: 12px;
`
const IconLink = styled.a`
  height: 12px;
  margin-left: 8px;
`
const Icon = styled.img`
  height: 18px;
`
export default function Footer() {

  return (
    <FooterSection>
      <FooterWrapper>
        <LogoTitle src={LogoH} alt="CheeseSwap Logo" />
        <Title>
          Decentralize Finance & Entertainment Project
        </Title>
        <Title2>
          © 2020 Ǒmega Protocol Ltd.
        </Title2>
        <Title2>
          Registered No: 12855720
        </Title2>
          <SocialSection>
            <IconLink href="https://twitter.com/cheeseswapbsc" target="_blank" rel="noopener noreferrer">
              <Icon src={Twitter} alt="Twitter" />
            </IconLink>
            <IconLink href="https://t.me/cheesemakerfarm" target="_blank" rel="noopener noreferrer">
              <Icon src={Telegram} alt="Telegram" />
            </IconLink>
            <IconLink href="https://github.com/cheeseswapbsc/" target="_blank" rel="noopener noreferrer">
              <Icon src={Github} alt="Github" />
            </IconLink>
            <IconLink href="mailto:info@cheeseswap.app" target="_blank" rel="noopener noreferrer">
              <Icon src={Mail} alt="Mail" />
            </IconLink>
          </SocialSection>
      </FooterWrapper>
      <FooterWrapper>
      <Title>
      Products
      </Title>
        <StyledAbsoluteLink href="#/swap" target="_blank">
          Swap
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="#/pool" target="_blank">
          Pool
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://farm.cheeseswap.app" target="_blank">
          Farm
        </StyledAbsoluteLink>
      </FooterWrapper>
      <FooterWrapper>
      <Title>
      Useful Links
      </Title>
        <StyledAbsoluteLink href="https://info.cheeseswap.app" target="_blank">
          Analytics
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://coinmarketcap.com/currencies/cheeseswap/" target="_blank" rel="noopener noreferrer">
          CoinMarketCap
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://www.coingecko.com/en/coins/cheeseswap" target="_blank" rel="noopener noreferrer">
          CoinGecko
        </StyledAbsoluteLink>
      </FooterWrapper>
      <FooterWrapper>
      <Title>
      Documentation
      </Title>
        <StyledAbsoluteLink href="https://docs.cheesemaker.farm" target="_blank">
          Docs
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://api.cheeseswap.app" target="_blank">
          API
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://data.cheeseswap.app/totalliquidity" target="_blank">
          TVL
        </StyledAbsoluteLink>
      </FooterWrapper>
      <FooterWrapper>
      <Title>
      Partners
      </Title>
        <StyledAbsoluteLink href="https://keep3rb.network" target="_blank">
          Keep3r BSC
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://kiwiswap.finance" target="_blank" rel="noopener noreferrer">
          Kiwi Finance
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://pizzafinance.app" target="_blank" rel="noopener noreferrer">
          Pizza Finance
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://farm.cheeseswap.app" target="_blank">
          HOTS Token
        </StyledAbsoluteLink>
      </FooterWrapper>
    </FooterSection>

  )
}
