import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { abi as ICheeseSwapPairABI } from '@cheeseswapv2/core/build/ICheeseSwapPair.json'
import { useMemo } from 'react'
import ERC20_ABI from '../constants/abis/erc20.json'
import { ListenerOptions } from '../state/multicall/actions'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../state/multicall/hooks'

const PAIR_INTERFACE = new Interface(ICheeseSwapPairABI)
const ERC20_INTERFACE = new Interface(ERC20_ABI as any)

function dedupeAddresses(addresses: (string | undefined)[]): string[] {
  const seen = new Set<string>()
  const sanitized: string[] = []

  addresses.forEach(address => {
    if (!address) return
    const normalized = address.toLowerCase()
    if (seen.has(normalized)) return
    seen.add(normalized)
    sanitized.push(address)
  })

  return sanitized
}

export type PairMetadata = {
  token0?: string
  token1?: string
  loading: boolean
}

export type PairMetadataMap = Record<string, PairMetadata>

export function usePairMetadataMap(
  addresses: (string | undefined)[],
  options: ListenerOptions = NEVER_RELOAD
): PairMetadataMap {
  const sanitized = useMemo(() => dedupeAddresses(addresses), [addresses])
  const token0Results = useMultipleContractSingleData(sanitized, PAIR_INTERFACE, 'token0', undefined, options)
  const token1Results = useMultipleContractSingleData(sanitized, PAIR_INTERFACE, 'token1', undefined, options)

  return useMemo(() => {
    return sanitized.reduce<PairMetadataMap>((memo, address, index) => {
      const key = address.toLowerCase()
      memo[key] = {
        token0: token0Results[index]?.result?.[0],
        token1: token1Results[index]?.result?.[0],
        loading: Boolean(token0Results[index]?.loading || token1Results[index]?.loading)
      }
      return memo
    }, {})
  }, [sanitized, token0Results, token1Results])
}

export type TokenMetadata = {
  symbol?: string
  decimals?: number
  loading: boolean
}

export type TokenMetadataMap = Record<string, TokenMetadata>

export function useTokenMetadataMap(
  addresses: (string | undefined)[],
  options: ListenerOptions = NEVER_RELOAD
): TokenMetadataMap {
  const sanitized = useMemo(() => dedupeAddresses(addresses), [addresses])
  const symbolResults = useMultipleContractSingleData(sanitized, ERC20_INTERFACE, 'symbol', undefined, options)
  const decimalsResults = useMultipleContractSingleData(sanitized, ERC20_INTERFACE, 'decimals', undefined, options)

  return useMemo(() => {
    return sanitized.reduce<TokenMetadataMap>((memo, address, index) => {
      const key = address.toLowerCase()
      const symbolResultRaw = symbolResults[index]?.result?.[0]
      const symbol = typeof symbolResultRaw === 'string' && symbolResultRaw.length ? symbolResultRaw : undefined
      const decimalsResultRaw = decimalsResults[index]?.result?.[0]
      let decimals: number | undefined
      if (BigNumber.isBigNumber(decimalsResultRaw)) {
        decimals = decimalsResultRaw.toNumber()
      } else if (typeof decimalsResultRaw === 'number' && Number.isFinite(decimalsResultRaw)) {
        decimals = decimalsResultRaw
      }

      memo[key] = {
        symbol,
        decimals,
        loading: Boolean(symbolResults[index]?.loading || decimalsResults[index]?.loading)
      }
      return memo
    }, {})
  }, [sanitized, symbolResults, decimalsResults])
}
