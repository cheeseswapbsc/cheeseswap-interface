import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@cheeseswapv2/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import Question from '../../components/QuestionHelper'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../components/Shared'
import { Text } from 'rebass'
import { LightCard } from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import AppBody from '../AppBody'
import { Dots } from '../../components/swap/styleds'
import TranslatedText from '../../components/TranslatedText'
import { TranslateString } from '../../utils/translateTextHelpers'

const PageContainer = styled.div<{ showChart?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.85rem;
  width: 100%;
  max-width: ${({ showChart }) => (showChart ? '1120px' : '460px')};
  margin: 0 auto;
  justify-content: ${({ showChart }) => (showChart ? 'flex-start' : 'center')};
  transition: max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    max-width: 100%;
  `}
`

const PoolContainer = styled.div`
  width: 100%;
  max-width: 460px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 100%;
  `}
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  return (
    <>
      <PageContainer showChart={false}>
        <PoolContainer>
          <AppBody>
            <SwapPoolTabs active={'pool'} />
              <AutoColumn gap="lg" justify="center" style={{ marginTop: '1.5rem' }}>
                <ButtonPrimary id="join-pool-button" as={Link} style={{ padding: 10 }} to="/add/ETH">
                <Text fontWeight={700} fontSize={16}>
                  <TranslatedText translationId={100}>Add Liquidity</TranslatedText>
                </Text>
              </ButtonPrimary>

              <AutoColumn gap="12px" style={{ width: '100%' }}>
            <RowBetween padding={'0 8px'}>
              <Text color={theme.colors.text1} fontWeight={700}>
                <TranslatedText translationId={102}>Major Liquidity</TranslatedText>
              </Text>
              <Question
                text={TranslateString(
                  130,
                  'When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.'
                )}
              />
            </RowBetween>

            {!account ? (
              <LightCard padding="40px">
                <TYPE.body color={theme.colors.text3} textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </LightCard>
            ) : v2IsLoading ? (
              <LightCard padding="40px">
                <TYPE.body color={theme.colors.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </LightCard>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                {allV2PairsWithLiquidity.map(v2Pair => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
                </>
            ) : (
              <LightCard padding="40px">
                <TYPE.body color={theme.colors.text3} textAlign="center">
                  <TranslatedText translationId={104}>We are sorry. No liquidity found.</TranslatedText>
                </TYPE.body>
              </LightCard>
            )}

            <div>
              <Text textAlign="center" fontSize={16} style={{ padding: '.5rem 0 .5rem 0' }}>
                {TranslateString(106, "Don't see a pool you joined?")}{' '}
                <StyledInternalLink id="import-pool-link" to="/find">
                  {TranslateString(108, 'Import it.')}
                </StyledInternalLink>
              </Text>
            </div>
          </AutoColumn>
        </AutoColumn>
          </AppBody>
        </PoolContainer>
      </PageContainer>
    </>
  )
}
