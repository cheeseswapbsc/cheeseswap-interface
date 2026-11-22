import React, { lazy, Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Switch, Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Popups from '../components/Popups'
// import BottomRightPopup from '../components/BottomRightPopup'
import Web3ReactManager from '../components/Web3ReactManager'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
// import Farm from './Farm'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import { EN } from '../constants/localisation/languageCodes'
import { LanguageContext } from '../hooks/LanguageContext'
import { TranslationsContext } from '../hooks/TranslationsContext'
import { allLanguages } from '../constants/localisation/languageCodes'

const TransactionsPage = lazy(() => import('./Transactions'))
const AddLiquidity = lazy(() => import('./AddLiquidity'))
const Pool = lazy(() => import('./Pool'))
const PoolFinder = lazy(() => import('./PoolFinder'))
const RemoveLiquidity = lazy(() => import('./RemoveLiquidity'))
const Swap = lazy(() => import('./Swap'))
const CrossChainBridge = lazy(() => import('./CrossChainBridge'))
const Recover = lazy(() => import('./Recover'))
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'))
const TermsOfService = lazy(() => import('./TermsOfService'))

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  min-height: 100vh;
  min-height: 100dvh;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const InfoBanner = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: fixed;
  top: 74px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9;
  padding: 5px 10px 5px 14px;
  font-size: 12.5px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text2};
  background: ${({ theme }) => theme.colors.bg1};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  border-radius: 999px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);

  strong {
    color: ${({ theme }) => theme.colors.primary1};
    font-weight: 700;
  }

  a {
    color: ${({ theme }) => theme.colors.primary1};
    font-weight: 700;
    text-decoration: none;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    margin: 0 auto;
    max-width: 100%;
    font-size: 11px;
    padding: 5px 8px 5px 12px;
    white-space: normal;
    text-align: center;
    border-radius: 12px;
  `};
`

const BannerClose = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text3};
  background: transparent;
  font-size: 12px;
  line-height: 1;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text1};
    background: ${({ theme }) => theme.colors.bg3};
  }
`

const BodyWrapper = styled.div<{ bannerVisible: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: ${({ bannerVisible }) => (bannerVisible ? '116px' : '86px')};
  padding-bottom: 18px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToMedium`
      padding-left: 16px;
      padding-right: 16px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
      padding: 16px;
  `};
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: auto 0;
`

const BANNER_DISMISSED_KEY = 'cheeseswap:lpRecoveryBannerDismissed'

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(undefined)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(undefined)
  const [translations, setTranslations] = useState<Array<any>>([])
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(BANNER_DISMISSED_KEY) === 'true'
    } catch {
      return false
    }
  })

  const dismissBanner = () => {
    setBannerDismissed(true)
    try {
      localStorage.setItem(BANNER_DISMISSED_KEY, 'true')
    } catch {
      // storage unavailable; dismissal still applies for this session
    }
  }

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter(language => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem('cheeseSwapLanguage')
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode)
      setSelectedLanguage(storedLang)
      setTranslatedLanguage(storedLang)
    } else {
      setSelectedLanguage(EN)
      setTranslatedLanguage(EN)
    }
  }, [])

  return (
    <Suspense fallback={null}>
      <HashRouter>
        <Route component={GoogleAnalyticsReporter} />
        <AppWrapper>
          <LanguageContext.Provider
            value={{ selectedLanguage, setSelectedLanguage, translatedLanguage, setTranslatedLanguage }}
          >
            <TranslationsContext.Provider value={{ translations, setTranslations }}>
              <HeaderWrapper>
                <Header />
              </HeaderWrapper>
              {!bannerDismissed && (
                <InfoBanner>
                  <span>
                    <RouterLink to="/recover">
                      <strong>DeFi front-end down?</strong>
                    </RouterLink>{' '}
                    Recover your LP tokens directly from any Ethereum or BSC AMM/MasterChef.
                    <RouterLink to="/recover">For quick service, Click here</RouterLink>
                  </span>
                  <BannerClose onClick={dismissBanner} aria-label="Dismiss banner">
                    ✕
                  </BannerClose>
                </InfoBanner>
              )}
              <BodyWrapper bannerVisible={!bannerDismissed}>
               <Popups />
               <ContentWrapper>
                <Web3ReactManager>
                  <Switch>
                    <Route exact strict path="/swap" component={Swap} />
                    {/*<Route exact strict path="/farm" component={Farm} />*/}
                    <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                    <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                    <Route exact strict path="/find" component={PoolFinder} />
                    <Route exact strict path="/pool" component={Pool} />
                    <Route exact strict path="/bridge" component={CrossChainBridge} />
                  <Route exact strict path="/recover" component={Recover} />
                    <Route exact strict path="/transactions" component={TransactionsPage} />
                    <Route exact strict path="/privacy-policy" component={PrivacyPolicy} />
                    <Route exact strict path="/terms-of-service" component={TermsOfService} />
                    <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                    <Route exact path="/add" component={AddLiquidity} />
                    <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                    <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                    <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                    <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                    <Route component={RedirectPathToSwapOnly} />
                  </Switch>
                </Web3ReactManager>
               </ContentWrapper>
              </BodyWrapper>
              <Footer />
        {/*   <BottomRightPopup /> */}
            </TranslationsContext.Provider>
          </LanguageContext.Provider>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}
