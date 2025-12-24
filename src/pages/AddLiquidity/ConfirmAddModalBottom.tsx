import { Currency, CurrencyAmount, Fraction, Percent } from '@cheeseswapv2/sdk'
import React from 'react'
import { Text } from 'rebass'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../components/Shared'

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  return (
    <>
      <RowBetween>
        <TYPE.Body>{currencies[Field.CURRENCY_A]?.symbol} Deposited</TYPE.Body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <TYPE.Body>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TYPE.Body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.Body>{currencies[Field.CURRENCY_B]?.symbol} Deposited</TYPE.Body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <TYPE.Body>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TYPE.Body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.Body>Rates</TYPE.Body>
        <TYPE.Body>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </TYPE.Body>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <TYPE.Body>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
            currencies[Field.CURRENCY_A]?.symbol
          }`}
        </TYPE.Body>
      </RowBetween>
      <RowBetween>
        <TYPE.Body>Share of Pool:</TYPE.Body>
        <TYPE.Body>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.Body>
      </RowBetween>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={700} fontSize={20}>
          {noLiquidity ? 'Create Pool & Supply' : 'Confirm Supply'}
        </Text>
      </ButtonPrimary>
    </>
  )
}
