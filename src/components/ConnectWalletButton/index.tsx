import React from 'react'
import { Button, ButtonProps, ConnectorId, useWalletModal } from '@cheeseswapv2/ui-sdk'
import { connectWallet } from '../../connectors'
import { useWeb3 } from '../../providers/Web3Provider'
import useI18n from '../../hooks/useI18n'

const UnlockButton: React.FC<ButtonProps> = props => {
  const TranslateString = useI18n()
  const { account, disconnect } = useWeb3()

  const handleLogin = async (connectorId: ConnectorId) => {
    if (connectorId === 'walletconnect') {
      await connectWallet('WALLETCONNECT')
    } else {
      await connectWallet('METAMASK')
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
