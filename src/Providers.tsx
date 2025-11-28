import React from 'react'
import { Provider } from 'react-redux'
import { ModalProvider } from '@cheeseswapv2/ui-sdk'
import store from './state'
import { ThemeContextProvider } from './ThemeContext'
import { Web3Provider } from './providers/Web3Provider'

const Providers: React.FC = ({ children }) => {
  return (
    <Web3Provider>
      <Provider store={store}>
        <ThemeContextProvider>
          <ModalProvider>{children}</ModalProvider>
        </ThemeContextProvider>
      </Provider>
    </Web3Provider>
  )
}

export default Providers
