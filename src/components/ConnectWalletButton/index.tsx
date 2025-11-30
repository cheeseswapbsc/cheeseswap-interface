import React from 'react'
import { Button, ButtonProps, ConnectorId, useWalletModal } from '@cheeseswapv2/ui-sdk'
import { useWeb3 } from '../../providers/Web3Provider'
import useI18n from '../../hooks/useI18n'
import { WalletType } from '../../connectors/utils'

const UnlockButton: React.FC<ButtonProps> = props => {
  const TranslateString = useI18n()
  const { account, disconnect, connect } = useWeb3()

  const handleLogin = async (connectorId: ConnectorId) => {
    console.log('[UnlockButton] Attempting to connect with:', connectorId)
    
    try {
      // Convert ConnectorId to WalletType for Web3Provider
      // The Web3Provider's connect method will handle the actual connection
      let walletType: WalletType
      
      switch (connectorId) {
        case 'metamask':
          walletType = 'METAMASK'
          break
        case 'trustwallet':
          walletType = 'TRUST_WALLET'
          break
        case 'okxwallet':
          walletType = 'OKX_WALLET'
          break
        case 'fantomwallet':
          walletType = 'FANTOM_WALLET'
          break
        case 'walletconnect':
          walletType = 'WALLETCONNECT'
          break
        case 'coinbasewallet':
          walletType = 'COINBASE'
          break
        case 'binance':
        case 'injected':
        default:
          // Binance and generic injected use METAMASK type for now
          walletType = 'METAMASK'
      }
      
      // Use Web3Provider's connect which updates React context
      await connect(walletType)
      console.log('[UnlockButton] Successfully connected with:', connectorId)
    } catch (error) {
      console.error('[UnlockButton] Connection failed:', error)
      // Re-throw to let WalletCard handle the error and show refresh button
      throw error
    }
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, disconnect, account as string)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, 'Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
