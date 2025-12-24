import React, { useEffect, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { gql } from '@apollo/client'
import { ChainId } from '@cheeseswapv2/sdk'
import CoinLogo from '../../components/cheese/CoinLogo'
import { ExternalLink } from '../../components/Shared'
import { useActiveWeb3React } from '../../hooks'
import { useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { getBscscanLink } from '../../utils'
import { SUPPORTED_CHAIN_ID } from '../../constants'
import { getTokenLogoURL } from '../../components/CurrencyLogo'
import { getTransactionsClient } from '../../apollo/client'

const PageWrapper = styled.div`
  width: min(98vw, 1260px);
  max-width: 1260px;
  padding: 2rem 1.25rem 3.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 0 auto;
`

const Title = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.text1};
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const pulse = keyframes`
  0% {
    opacity: 0.3;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.3;
    transform: scale(0.9);
  }
`

const LiveIndicator = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.green1 || '#2ecc71'};
  box-shadow: 0 0 6px rgba(46, 204, 113, 0.7);
  animation: ${pulse} 1.4s ease-in-out infinite;
`

const Card = styled.div`
  width: 100%;
  border-radius: 28px;
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  background: ${({ theme }) => theme.colors.bg1};
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.12);
  padding: 2rem;
  overflow-x: auto;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 1.35fr) minmax(260px, 1.35fr) minmax(200px, 0.9fr) minmax(220px, 0.9fr) minmax(140px, 0.6fr);
  gap: 1.2rem;
  align-items: center;
  min-width: 1080px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 880px;
  `};
`

const HeaderRow = styled(Grid)`
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.text1};
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.25rem;
  border-radius: 16px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.bg2} 0%, ${({ theme }) => theme.colors.bg3} 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
`

const DataRow = styled(Grid)`
  padding: 1rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.bg3};
  font-size: 0.95rem;
`

const TokenCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const TokenLogoLink = styled(ExternalLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: transform 0.15s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
  }
`

const TokenText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  gap: 0.15rem;

  strong {
    color: ${({ theme }) => theme.colors.text1};
    font-size: 1rem;
  }

  span {
    color: ${({ theme }) => theme.colors.text2};
    font-size: 0.85rem;
  }
`

const HashLink = styled(ExternalLink)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text1};
  text-decoration: none;
  word-break: break-all;

  &:hover {
    color: ${({ theme }) => theme.colors.primary1};
  }
`

const StatusPill = styled.span<{ variant: 'success' | 'pending' | 'failed' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: capitalize;
  color: ${({ variant, theme }) =>
    variant === 'success' ? theme.colors.white : variant === 'failed' ? theme.colors.white : theme.colors.text1};
  background: ${({ variant, theme }) => {
    switch (variant) {
      case 'success':
        return theme.colors.primary1
      case 'failed':
        return theme.colors.red1
      default:
        return theme.colors.bg3
    }
  }};
`

const EmptyState = styled.div`
  padding: 2rem 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text2};
  font-size: 1rem;
`

const BottomNote = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text2};
  font-size: 0.85rem;
  margin-top: 12px;
`

const BottomLink = styled(ExternalLink)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary1};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.75rem;
  width: 100%;
`

const PageButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  background: ${({ theme }) => theme.colors.bg1};
  color: ${({ theme }) => theme.colors.text1};
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    color: ${({ theme }) => theme.colors.primary1};
    border-color: ${({ theme }) => theme.colors.primary1};
  }
`

const PageIndicator = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text2};
  min-width: 110px;
  text-align: center;
`

const ROWS_PER_PAGE = 20
const MAX_CACHED_ROWS = 100
const FETCH_INTERVAL_MS = 60_000
const ROUTER_CACHE_STORAGE_KEY = 'cheeseswap:transactions:routerRows:v1'

const TRANSACTION_SWAPS_QUERY = gql`
  query TransactionSwaps($first: Int!) {
    swaps(first: $first, orderBy: timestamp, orderDirection: desc) {
      id
      transaction {
        id
        timestamp
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      pair {
        id
        token0 {
          id
          symbol
          decimals
        }
        token1 {
          id
          symbol
          decimals
        }
      }
    }
  }
`

type SubgraphToken = {
  id: string
  symbol?: string | null
  decimals?: string | null
}

type SubgraphPair = {
  id: string
  token0?: SubgraphToken | null
  token1?: SubgraphToken | null
}

type SubgraphSwap = {
  id: string
  transaction?: {
    id: string
    timestamp?: string | null
  } | null
  amount0In?: string | null
  amount0Out?: string | null
  amount1In?: string | null
  amount1Out?: string | null
  pair?: SubgraphPair | null
}

type TransactionSwapsResponse = {
  swaps: SubgraphSwap[]
}

type SwapSlice = {
  inputAmount?: string
  inputSymbol?: string
  outputAmount?: string
  outputSymbol?: string
}

type DisplayRow = {
  rowKey: string
  hash: string
  fromAmount: string
  fromSymbol: string
  fromLogoSrcs: string[]
  fromTokenAddress?: string
  toAmount: string
  toSymbol: string
  toLogoSrcs: string[]
  toTokenAddress?: string
  timestamp?: number
  status: 'success' | 'pending' | 'failed'
}

type RouterCachePayload = {
  chainId: number
  rows: DisplayRow[]
  updatedAt: number
}

function areDisplayRowsEqual(left: DisplayRow[], right: DisplayRow[]): boolean {
  if (left.length !== right.length) return false
  for (let i = 0; i < left.length; i++) {
    const a = left[i]
    const b = right[i]
    if (!b) return false
    if (
      a.rowKey !== b.rowKey ||
      a.hash !== b.hash ||
      a.fromAmount !== b.fromAmount ||
      a.fromSymbol !== b.fromSymbol ||
      a.toAmount !== b.toAmount ||
      a.toSymbol !== b.toSymbol ||
      a.timestamp !== b.timestamp
    ) {
      return false
    }
  }
  return true
}

function parseSwapSummary(summary?: string): SwapSlice {
  if (!summary) return {}
  const regex = /Swap\s([\d.,]+)\s([^\s]+)\sfor\s([\d.,]+)\s([^\s]+)/i
  const match = summary.match(regex)
  if (!match) return {}
  return {
    inputAmount: match[1],
    inputSymbol: match[2],
    outputAmount: match[3],
    outputSymbol: match[4]
  }
}

function buildLogoSrcs(symbol?: string, address?: string): string[] {
  const sources: string[] = []
  if (address) {
    sources.push(getTokenLogoURL(address))
  }
  if (symbol) {
    sources.push(`/images/coins/${symbol.toUpperCase()}.png`, `/images/coins/${symbol.toLowerCase()}.png`)
  }
  sources.push('/images/coins/token.png')
  return sources
}

function formatAmount(value?: string | null): string {
  const parsed = Number(value ?? '0')
  if (!Number.isFinite(parsed) || parsed === 0) return '0'
  if (parsed >= 1) {
    return parsed.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }
  return parsed.toPrecision(4)
}

function getStatus(tx: TransactionDetails): 'success' | 'pending' | 'failed' {
  if (!tx.receipt) return 'pending'
  return tx.receipt.status ? 'success' : 'failed'
}

function safeShorten(hash: string): string {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

function formatTimestamp(value?: number): string {
  if (!value || Number.isNaN(value)) return '—'
  try {
    return new Date(value).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return '—'
  }
}

function mapSwapToDisplayRow(swap: SubgraphSwap): DisplayRow | null {
  const pair = swap.pair
  if (!pair?.token0 || !pair?.token1) return null

  const amount0In = Number(swap.amount0In ?? '0')
  const amount0Out = Number(swap.amount0Out ?? '0')

  const fromToken = amount0In > 0 ? pair.token0 : pair.token1
  const toToken = amount0Out > 0 ? pair.token0 : pair.token1
  const fromAmountRaw = amount0In > 0 ? swap.amount0In : swap.amount1In
  const toAmountRaw = amount0Out > 0 ? swap.amount0Out : swap.amount1Out

  if (!fromToken || !toToken || (!Number(fromAmountRaw ?? '0') && !Number(toAmountRaw ?? '0'))) {
    return null
  }

  const fromSymbol = fromToken.symbol || fromToken.id.slice(0, 6)
  const toSymbol = toToken.symbol || toToken.id.slice(0, 6)
  const timestamp = swap.transaction?.timestamp ? Number(swap.transaction.timestamp) * 1000 : undefined
  const hash = swap.transaction?.id ?? swap.id

  return {
    rowKey: swap.id,
    hash,
    fromAmount: formatAmount(fromAmountRaw),
    fromSymbol,
    fromLogoSrcs: buildLogoSrcs(fromSymbol, fromToken.id),
    fromTokenAddress: fromToken.id,
    toAmount: formatAmount(toAmountRaw),
    toSymbol,
    toLogoSrcs: buildLogoSrcs(toSymbol, toToken.id),
    toTokenAddress: toToken.id,
    timestamp,
    status: 'success'
  }
}

function readRouterCache(chainId: number): DisplayRow[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(ROUTER_CACHE_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as RouterCachePayload
    if (!parsed || parsed.chainId !== chainId || !Array.isArray(parsed.rows)) {
      return []
    }
    return parsed.rows.map((row, index) => ({
      ...row,
      rowKey: row.rowKey ?? `${row.hash}-${row.timestamp ?? 0}-${index}`
    }))
  } catch (error) {
    console.warn('Failed to read router cache', error)
    return []
  }
}

function persistRouterCache(chainId: number, rows: DisplayRow[]): void {
  if (typeof window === 'undefined') return
  try {
    const payload: RouterCachePayload = {
      chainId,
      rows,
      updatedAt: Date.now()
    }
    window.localStorage.setItem(ROUTER_CACHE_STORAGE_KEY, JSON.stringify(payload))
  } catch (error) {
    console.warn('Failed to persist router cache', error)
  }
}

export default function TransactionsPage() {
  const allTransactions = useAllTransactions()
  const { chainId } = useActiveWeb3React()
  const resolvedChainId = (chainId ?? SUPPORTED_CHAIN_ID) as ChainId
  const [routerRows, setRouterRows] = useState<DisplayRow[]>(() => readRouterCache(resolvedChainId))
  const [loadingRouter, setLoadingRouter] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const transactionsClient = useMemo(() => getTransactionsClient(), [])

  useEffect(() => {
    setRouterRows(readRouterCache(resolvedChainId))
  }, [resolvedChainId])
  useEffect(() => {
    if (!transactionsClient) {
      setLoadingRouter(false)
      return
    }

    let cancelled = false

    const load = async () => {
      setLoadingRouter(true)
      try {
        const { data } = await transactionsClient.query<TransactionSwapsResponse>({
          query: TRANSACTION_SWAPS_QUERY,
          variables: { first: MAX_CACHED_ROWS }
        })
        if (cancelled) return
        const rows = (data?.swaps ?? [])
          .map(mapSwapToDisplayRow)
          .filter((row): row is DisplayRow => Boolean(row))

        setRouterRows(previous => {
          if (areDisplayRowsEqual(previous, rows)) {
            return previous
          }
          persistRouterCache(resolvedChainId, rows)
          return rows
        })
      } catch (error) {
        if (!cancelled) {
          console.error('Unable to load swaps from subgraph', error)
        }
      } finally {
        if (!cancelled) {
          setLoadingRouter(false)
        }
      }
    }

    load()
    const interval = setInterval(load, FETCH_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [transactionsClient, resolvedChainId])

  const localRows = useMemo<DisplayRow[]>(() => {
    const values = Object.values(allTransactions ?? {})
    return values
      .filter(tx => tx.summary?.toLowerCase().startsWith('swap '))
      .sort((a, b) => b.addedTime - a.addedTime)
      .slice(0, MAX_CACHED_ROWS)
      .map(tx => {
        const { inputAmount, inputSymbol, outputAmount, outputSymbol } = parseSwapSummary(tx.summary)
        return {
          rowKey: `local-${tx.hash}`,
          hash: tx.hash,
          fromAmount: inputAmount ?? '—',
          fromSymbol: inputSymbol ?? 'Unknown',
          fromLogoSrcs: buildLogoSrcs(inputSymbol),
          toAmount: outputAmount ?? '—',
          toSymbol: outputSymbol ?? 'Unknown',
          toLogoSrcs: buildLogoSrcs(outputSymbol),
          timestamp: tx.addedTime,
          status: getStatus(tx)
        }
      })
  }, [allTransactions])

  const rowsToDisplay = routerRows.length ? routerRows : localRows
  const showingRouterFeed = routerRows.length > 0
  const totalPages = rowsToDisplay.length ? Math.ceil(rowsToDisplay.length / ROWS_PER_PAGE) : 0
  const paginatedRows = rowsToDisplay.slice(
    currentPage * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE + ROWS_PER_PAGE
  )
  const shouldShowPagination = rowsToDisplay.length > ROWS_PER_PAGE && totalPages > 0

  useEffect(() => {
    setCurrentPage(0)
  }, [showingRouterFeed])

  useEffect(() => {
    if (!totalPages && currentPage !== 0) {
      setCurrentPage(0)
      return
    }
    if (totalPages && currentPage >= totalPages) {
      setCurrentPage(totalPages - 1)
    }
  }, [totalPages, currentPage])

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0))
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.max(totalPages - 1, 0)))
  const renderPagination = (style?: React.CSSProperties) => (
    <Pagination style={style}>
      <PageButton onClick={handlePrevPage} disabled={currentPage === 0}>
        Previous
      </PageButton>
      <PageIndicator>
        Page {currentPage + 1} / {totalPages}
      </PageIndicator>
      <PageButton onClick={handleNextPage} disabled={currentPage + 1 >= totalPages}>
        Next
      </PageButton>
    </Pagination>
  )

  return (
    <PageWrapper>
      <TitleRow>
        <Title>Transactions</Title>
        <LiveIndicator aria-label="Live feed indicator" />
      </TitleRow>
      <Card>
        {shouldShowPagination && renderPagination({ marginTop: 0, marginBottom: '0.75rem' })}
        <HeaderRow>
          <div>From</div>
          <div>To</div>
          <div>Tx Hash</div>
          <div>Time Stamp</div>
          <div>Status</div>
        </HeaderRow>
        {rowsToDisplay.length === 0 ? (
          <EmptyState>
            {loadingRouter ? 'Loading recent swaps from router…' : 'No recent swap transactions yet.'}
          </EmptyState>
        ) : (
          paginatedRows.map(row => {
            const explorerChainId = chainId ?? SUPPORTED_CHAIN_ID
            const link = row.hash ? getBscscanLink(explorerChainId, row.hash, 'transaction') : undefined
            const fromTokenLink = row.fromTokenAddress
              ? getBscscanLink(explorerChainId, row.fromTokenAddress, 'token')
              : undefined
            const toTokenLink = row.toTokenAddress
              ? getBscscanLink(explorerChainId, row.toTokenAddress, 'token')
              : undefined

            return (
              <DataRow key={row.rowKey}>
                <TokenCell>
                  {fromTokenLink ? (
                    <TokenLogoLink href={fromTokenLink} target="_blank" rel="noopener noreferrer">
                      <CoinLogo size="44px" srcs={row.fromLogoSrcs} alt={`${row.fromSymbol} logo`} />
                    </TokenLogoLink>
                  ) : (
                    <CoinLogo size="44px" srcs={row.fromLogoSrcs} alt={`${row.fromSymbol} logo`} />
                  )}
                  <TokenText>
                    <strong>{row.fromAmount}</strong>
                    <span>{row.fromSymbol}</span>
                  </TokenText>
                </TokenCell>

                <TokenCell>
                  {toTokenLink ? (
                    <TokenLogoLink href={toTokenLink} target="_blank" rel="noopener noreferrer">
                      <CoinLogo size="44px" srcs={row.toLogoSrcs} alt={`${row.toSymbol} logo`} />
                    </TokenLogoLink>
                  ) : (
                    <CoinLogo size="44px" srcs={row.toLogoSrcs} alt={`${row.toSymbol} logo`} />
                  )}
                  <TokenText>
                    <strong>{row.toAmount}</strong>
                    <span>{row.toSymbol}</span>
                  </TokenText>
                </TokenCell>

                {link ? (
                  <HashLink href={link} target="_blank" rel="noopener noreferrer">
                    {safeShorten(row.hash)} ↗
                  </HashLink>
                ) : (
                  <span>{safeShorten(row.hash)}</span>
                )}

                <span>{formatTimestamp(row.timestamp)}</span>

                <StatusPill variant={row.status}>{row.status}</StatusPill>
              </DataRow>
            )
          })
        )}
        {shouldShowPagination && renderPagination()}
      </Card>
      <BottomNote>
        <span>
          {showingRouterFeed
            ? 'Showing last tracked transactions by GraphQL API. To view more details & depth data visit'
            : 'GraphQL feed temporarily unavailable. Displaying your latest wallet swaps instead.'}
        </span>
        <BottomLink href="https://info.cheeseswap.app" target="_blank" rel="noopener noreferrer">
          Analytics V2 ↗
        </BottomLink>
      </BottomNote>
    </PageWrapper>
  )
}
