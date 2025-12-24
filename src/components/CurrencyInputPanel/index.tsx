import { Currency, Pair } from '@cheeseswapv2/sdk'
import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
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
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  width: 100%;
  box-sizing: border-box;
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  min-width: 76px;
  height: 2.34rem;
  font-size: 13.6px;
  font-weight: 600;
  background: ${({ selected, theme }) => (selected ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.25)')};
  color: #FFFFFF;
  border-radius: 10.2px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: 1px solid rgba(102, 126, 234, 0.45);
  padding: 0 0.72rem;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: none !important;

  :hover {
    border-color: rgba(102, 126, 234, 0.65);
    background: rgba(102, 126, 234, 0.35);
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
    font-size: 0.68rem;
    line-height: 0.85rem;
  font-size: 0.68rem;
  line-height: 0.85rem;
  padding: 0 0.21rem;
  margin-bottom: 0.55rem;
  letter-spacing: 0.01em;
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
  ${({ theme }) => theme.flexColumnNoWrap};
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8.5px' : '15.3px')};
  z-index: 1;
  width: 100%;
`

const Container = styled.div<{ hideInput: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  background: ${({ theme }) => theme.colors.bg1};
  border-radius: ${({ hideInput }) => (hideInput ? '8.5px' : '15.3px')};
  box-shadow: none !important;
  width: 100%;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  margin: ${({ active }) => (active ? '0 0.43rem' : '0 0.3rem')};
  font-size: ${({ active }) => (active ? '14.45px' : '12.75px')};
  font-weight: 600;
  color: #FFFFFF;
  max-width: 119px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StyledBalanceMax = styled.button`
  height: 22.95px;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary5} 0%, ${theme.colors.primary3} 100%)`};
  border: none;
  border-radius: 7.65px;
  font-weight: 700;
  font-size: 0.48rem;
  cursor: pointer;
  margin-left: 0.32rem;
  padding: 0 0.7rem;
  white-space: nowrap;

  :hover {
    transform: translateY(-1px);
  }

  :focus {
    outline: none;
  }

  :active {
    transform: translateY(0);
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 0.32rem;
    padding: 0 0.57rem;
    height: 20.4px;
  `}
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
            <TYPE.Body color={theme.colors.text2} fontWeight={700} fontSize={13}>
              {label}
            </TYPE.Body>
            {account && (
              <TYPE.Body
                onClick={onMax}
                color={theme.colors.text2}
                fontWeight={700}
                fontSize={13}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {!hideBalance && !!currency && selectedCurrencyBalance
                  ? 'Balance: ' + selectedCurrencyBalance?.toSignificant(6)
                  : ' -'}
              </TYPE.Body>
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
