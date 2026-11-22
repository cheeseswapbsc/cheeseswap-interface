import React from 'react'
import { Provider } from 'react-redux'
import { ModalProvider } from '@cheeseswapv2/ui-sdk'
import store from './state'
import { ThemeContextProvider } from './ThemeContext'
import { Web3Provider } from './providers/Web3Provider'

// ui-sdk's ModalProvider is typed without children (built against older React types)
const ModalProviderWithChildren = ModalProvider as React.ComponentType<{ children?: React.ReactNode }>

const Providers: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Web3Provider>
      <Provider store={store}>
        <ThemeContextProvider>
          <ModalProviderWithChildren>{children}</ModalProviderWithChildren>
        </ThemeContextProvider>
      </Provider>
    </Web3Provider>
  )
}

export default Providers
