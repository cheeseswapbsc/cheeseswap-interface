import React from 'react'
import styled from 'styled-components'
import LogoH from '../../assets/images/cheeseswap-logo.png'
import Twitter from '../../assets/png/twitter.png'
import Discord from '../../assets/png/discord.png'
import Github from '../../assets/png/github.png'
import Mail from '../../assets/png/email.png'
import BuiltBSC from '../../assets/svg/built-on-bsc.svg'
import AuditCertik from '../../assets/svg/certik.svg'
import DeployIPFS from '../../assets/svg/ipfs.svg'

import Cmc from '../../assets/png/cmc.png'
import Cg from '../../assets/png/cg.png'
import DappRadar from '../../assets/png/dappradar.png'
import Dapp from '../../assets/png/dapp.png'


const FooterSection = styled.div`
  background: ${({ theme }) => theme.colors.bg1};
  box-sizing: border-box;
  z-index: inherit;
  margin: 0px;
  min-width: 0px;
  width: 100vw;
  display: flex;
  padding: 2rem 3rem 1.5rem 3rem;
  bottom: 0px;
  align-items: flex-start;
  justify-content: space-evenly;
  position: relative;
  @media (max-width: 480px) {
    flex-direction: column;
    justify-content: flex-start;
    padding: 1.5rem 1rem 1rem 1rem;
  }
`
const FooterWrapper = styled.div`
  padding: 18px;
`
const FooterWrapper2 = styled.div`
  padding: 2px;
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
const StyledAbsoluteImg = styled.a`
  color: ${({ theme }) => theme.colors.text1};
  margin: 4px;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.colors.text2};
  }
  &.active {
    color: ${({ theme }) => theme.colors.text2};
  }
  @media (max-width: 400px) {
    margin: 4px;
  }
`

const LogoTitle = styled.img`
  height: 40.5px;
`
const SocialSection = styled.div`
  margin: 6px;
`
const IconLink = styled.a`
  height: 12px;
  margin-left: 4px;
`
const Icon = styled.img`
  height: 24px;
`

export default function Footer() {

  return (
    <FooterSection>
      <FooterWrapper>
        <LogoTitle src={LogoH} alt="CheeseSwap Logo" />
        <Title>
          EVM Based Token Swap AMM Dex Platform
        </Title>
        <Title2>
          © Copyright 2020-2025 Cheeseswap.
        </Title2>
        <FooterWrapper>
            <StyledAbsoluteImg href="https://ipfs.io/" target="_blank" rel="noopener noreferrer">
              <img src={DeployIPFS} alt="IPFS" height="36" />
            </StyledAbsoluteImg>
            <StyledAbsoluteImg href="https://skynet.certik.com/projects/cheeseswap/" target="_blank" rel="noopener noreferrer">
              <img src={AuditCertik} alt="Certik" height="36" />
            </StyledAbsoluteImg>
          </FooterWrapper>
      </FooterWrapper>
      <FooterWrapper>
      <Title>
      Products
      </Title>
        <StyledAbsoluteLink href="#/swap" target="_blank" rel="nofollow noopener noreferrer">
          Swap
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="#/pool" target="_blank" rel="nofollow noopener noreferrer">
          Liquidity Pool
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://bulksender.cheeseswap.app" target="_blank" rel="nofollow noopener noreferrer">
          Bulk Sender
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://watcher.cheeseswap.app" target="_blank" rel="nofollow noopener noreferrer">
          Farm Watcher
        </StyledAbsoluteLink>
      </FooterWrapper>
      <FooterWrapper>
      <Title>
      Useful Links
      </Title>
      <StyledAbsoluteLink href="https://info.cheeseswap.app" target="_blank" rel="nofollow noopener noreferrer">
        Analytics
      </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://docs.cheeseswap.app" target="_blank" rel="nofollow noopener noreferrer">
          Docs
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://api.cheeseswap.app" target="_blank" rel="nofollow noopener noreferrer">
          API
        </StyledAbsoluteLink>
        <StyledAbsoluteLink href="https://certik.org/projects/cheeseswap/" target="_blank" rel="noopener noreferrer">
          Audit
        </StyledAbsoluteLink>
        </FooterWrapper>
      <FooterWrapper>
        <Title>
          Market Data
          </Title>
            <SocialSection>
              <IconLink href="https://coinmarketcap.com/exchanges/cheeseswap/" target="_blank" rel="noopener noreferrer">
                <Icon src={Cmc} alt="CoinMarketCap" />
              </IconLink>
              <IconLink href="https://www.coingecko.com/en/coins/cheeseswap" target="_blank" rel="noopener noreferrer">
                <Icon src={Cg} alt="CoinGecko" />
              </IconLink>
              <IconLink href="https://dappradar.com/binance-smart-chain/exchanges/cheeseswap" target="_blank" rel="noopener noreferrer">
                <Icon src={DappRadar} alt="DappRadar" />
              </IconLink>
              <IconLink href="https://www.dapp.com/app/cheeseswap" target="_blank" rel="noopener noreferrer">
                <Icon src={Dapp} alt="Dapp" />
              </IconLink>
            </SocialSection>
            <FooterWrapper2>
              <Title>
              Social Media
              </Title>
              <SocialSection>
                <IconLink href="https://twitter.com/cheeseswapbsc" target="_blank" rel="noopener noreferrer">
                  <Icon src={Twitter} alt="Twitter" />
                </IconLink>
                <IconLink href="https://discord.gg/KeFQnRmyW8" target="_blank" rel="noopener noreferrer">
                  <Icon src={Discord} alt="Discord" />
                </IconLink>
                <IconLink href="https://github.com/cheeseswapbsc/" target="_blank" rel="noopener noreferrer">
                  <Icon src={Github} alt="Github" />
                </IconLink>
                <IconLink href="mailto:info@cheeseswap.app" target="_blank" rel="noopener noreferrer">
                  <Icon src={Mail} alt="Mail" />
                </IconLink>
              </SocialSection>
            </FooterWrapper2>
            </FooterWrapper>
      <FooterWrapper>
      <Title>
      Built on
      </Title>
      <FooterWrapper2>
        <StyledAbsoluteImg href="https://www.binance.org/" target="_blank" rel="noopener noreferrer">
          <img src={BuiltBSC} alt="Binance Smart Chain" height="44" />
        </StyledAbsoluteImg>
      </FooterWrapper2>
      <FooterWrapper2>
      <StyledAbsoluteLink href="#/terms-of-service" aria-label="Terms of Service" target="_blank" rel="noopener noreferrer">
        Terms of Service
      </StyledAbsoluteLink>
      <StyledAbsoluteLink href="#/privacy-policy" aria-label="Privacy Policy" target="_blank" rel="noopener noreferrer">
         Privacy Policy
      </StyledAbsoluteLink>
      </FooterWrapper2>
      </FooterWrapper>
    </FooterSection>

  )
}
