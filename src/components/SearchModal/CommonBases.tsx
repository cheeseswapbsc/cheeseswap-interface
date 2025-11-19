import React from 'react'
import { Text } from 'rebass'
import { ChainId, Currency, currencyEquals, ETHER, Token } from '@cheeseswapv2/sdk'
import styled from 'styled-components'

import { SUGGESTED_BASES } from '../../constants'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow } from '../Row'
import CurrencyLogo from '../CurrencyLogo'

const TokenGrid = styled(AutoRow)`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    gap: 2px;
  `}
`

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 2px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.colors.bg3)};
  border-radius: 8px;
  display: flex;
  padding: 3px 5px;
  flex-shrink: 0;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.colors.bg2};
  }

  background-color: ${({ theme, disable }) => disable && theme.colors.bg3};
  opacity: ${({ disable }) => disable && '0.4'};
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 3px 5px;
    border-radius: 6px;
  `}
`

const LogoWrapper = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 6px;
  flex-shrink: 0;
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 18px;
    height: 18px;
    margin-right: 4px;
  `}
  
  img {
    width: 100%;
    height: 100%;
  }
`

const TokenText = styled(Text)`
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 11px;
  `}
`

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency
}: {
  chainId?: ChainId
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontWeight={700} fontSize={14}>
          Common bases
        </Text>
        <QuestionHelper text="These tokens are commonly paired with other tokens." />
      </AutoRow>
      <TokenGrid>
        <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER)
            }
          }}
          disable={selectedCurrency === ETHER}
        >
          <LogoWrapper>
            <CurrencyLogo currency={ETHER} />
          </LogoWrapper>
          <TokenText>
            BNB
          </TokenText>
        </BaseWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
              <LogoWrapper>
                <CurrencyLogo currency={token} />
              </LogoWrapper>
              <TokenText>
                {token.symbol}
              </TokenText>
            </BaseWrapper>
          )
        })}
      </TokenGrid>
    </AutoColumn>
  )
}
