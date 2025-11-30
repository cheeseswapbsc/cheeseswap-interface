import { Currency, Pair } from '@cheeseswapv2/sdk'
import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken, rgba } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { TYPE } from '../Shared'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import TranslatedText from '../../components/TranslatedText'
import { TranslateString } from '../../utils/translateTextHelpers'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 1.1rem 1.5rem;
  gap: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem 1.25rem;
    gap: 0.75rem;
  `}
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  min-width: 90px;
  height: 2.75rem;
  font-size: 16px;
  font-weight: 600;
  background: ${({ selected, theme }) => (selected ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.25)')};
  color: #FFFFFF;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: 1px solid rgba(102, 126, 234, 0.45);
  padding: 0 0.85rem;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);

  :focus,
  :hover {
    border-color: rgba(102, 126, 234, 0.65);
    background: rgba(102, 126, 234, 0.35);
    color: #FFFFFF;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.35);
    transform: translateY(-1px);
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 2.5rem;
    padding: 0 0.6rem;
    font-size: 14px;
    min-width: 70px;
  `}
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.colors.text3};
  font-size: 0.8rem;
  line-height: 1rem;
  padding: 0 0.25rem;
  margin-bottom: 0.65rem;
  letter-spacing: 0.01em;

  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.15, theme.colors.text1)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0rem 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: #FFFFFF;
    stroke-width: 1.4px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '10px' : '18px')};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '10px' : '18px')};
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  background: ${({ theme }) => theme.colors.bg1};
  box-shadow: inset 0 0 0 1px rgba(102, 126, 234, 0.1);
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.5rem 0 0.5rem;' : '  margin: 0 0.35rem 0 0.35rem;')}
  font-size:  ${({ active }) => (active ? '17px' : '15px')};
  font-weight: 600;
  color: #FFFFFF;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 90px;
    font-size: 14px;
  `}
`

const StyledBalanceMax = styled.button`
  /* 25% smaller from previous defaults */
  height: 27px;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary5} 0%, ${theme.colors.primary3} 100%)`};
  border: none;
  border-radius: 9px;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  margin-left: 0.375rem;
  padding: 0 0.825rem;
  color: ${({ theme }) => theme.colors.buttonText || '#f4f4fb'};
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;

  :hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => `0 6px 14px ${rgba(theme.colors.primary3, 0.35)}`};
  }

  :focus {
    outline: none;
  }

  :active {
    transform: translateY(0);
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 0.375rem;
    padding: 0 0.675rem;
    height: 24px;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = TranslateString(132, 'Input'),
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      {!hideInput && (
        <LabelRow>
          <RowBetween>
            <TYPE.body color={theme.colors.text2} fontWeight={700} fontSize={13}>
              {label}
            </TYPE.body>
            {account && (
              <TYPE.body
                onClick={onMax}
                color={theme.colors.text2}
                fontWeight={700}
                fontSize={13}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {!hideBalance && !!currency && selectedCurrencyBalance
                  ? 'Balance: ' + selectedCurrencyBalance?.toSignificant(6)
                  : ' -'}
              </TYPE.body>
            )}
          </RowBetween>
        </LabelRow>
      )}
      <Container hideInput={hideInput}>
        <InputRow style={hideInput ? { padding: '0', borderRadius: '10px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={26} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'26px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : currency?.symbol) || <TranslatedText translationId={82}>Select a Token</TranslatedText>}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
