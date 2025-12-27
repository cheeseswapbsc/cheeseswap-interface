import { Currency, ETHER, Token } from '@cheeseswapv2/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { getAddress } from '@ethersproject/address'

import EthereumLogo from '../../assets/images/binance-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import CoinLogo from '../../components/cheese/CoinLogo'

const TRUST_ASSET_HOST = 'https://raw.githubusercontent.com/trustwallet/assets'
const CHEESE_ASSET_HOST = 'https://raw.githubusercontent.com/cheeseswapbsc/assets'

const normalizeLogoUri = (uri: string) => {
  if (!uri) return uri
  return uri.startsWith(TRUST_ASSET_HOST) ? uri.replace(TRUST_ASSET_HOST, CHEESE_ASSET_HOST) : uri
}

const toChecksumAddress = (address: string) => {
  try {
    return getAddress(address)
  } catch (error) {
    return address
  }
}

export const getTokenLogoURL = (address: string) =>
  `${CHEESE_ASSET_HOST}/master/blockchains/smartchain/assets/${toChecksumAddress(address)}/logo.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const normalizedLocations = useMemo(() => uriLocations.map(normalizeLogoUri), [uriLocations])

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [getTokenLogoURL(currency.address), ...normalizedLocations]
      }

      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, normalizedLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }

  return (currency as any)?.symbol ? (
    <CoinLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  ) : (
    <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}
