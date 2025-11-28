import 'inter-ui'
import React, { StrictMode } from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import './i18n'
import App from './pages/App'
import store from './state'
import { useIsDarkMode } from './state/user/hooks'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import { lightTheme, darkTheme } from './theme'
import { FixedGlobalStyle, ThemedGlobalStyle } from './components/Shared'
import { Web3Provider } from './providers/Web3Provider'

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
  ReactGA.set({
    customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

window.addEventListener('error', error => {
  localStorage && localStorage.removeItem('redux_localstorage_simple_lists')
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true
  })
})

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

function ThemeProvider({ children }: { children?: React.ReactNode }) {
  const isDark = useIsDarkMode()
  const theme = isDark ? darkTheme : lightTheme

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
}

ReactDOM.render(
  <StrictMode>
    <FixedGlobalStyle />
    <Web3Provider>
      <Provider store={store}>
        <Updaters />
        <ThemeProvider>
          <ThemedGlobalStyle />
          <App />
        </ThemeProvider>
      </Provider>
    </Web3Provider>
  </StrictMode>,
  document.getElementById('root')
)
