import { useQuery } from '@tanstack/react-query'
import type { Token } from '@balancer/sdk'
import { queryAPI } from '../services/balancerApi'

enum Chains {
  SEPOLIA = 11155111,
  ARBITRUM = 42161
}

function chainById(chainId: number): string {
  return Object.keys(Chains)[Object.values(Chains).indexOf(chainId)]
}

async function fetchTokens(chainId: number) {
  const chain = chainById(chainId)
  const query = `
query {
  tokenGetTokens(chains: [${chain}]) {
    address,
    name,
    symbol,
    decimals
  }
}
`
  
  return queryAPI(query)
}

export function useToken(chainId: number, symbol: string): Token | undefined {
  const { isPending, data } = useQuery({
    queryKey: ['fetch-tokens-by-chain'],
    queryFn: () => fetchTokens(chainId)
  })

  if (isPending) return
  
  // if (error) console.log(error)
  return data.data.tokenGetTokens.find((t: any) => t.symbol === symbol)
}

export type Price = {
  chain: string;
  address: string;
  price: number;
}

async function fetchPrices(chainId: number) {
  const chain = chainById(chainId)
  const query = `
query {
  tokenGetCurrentPrices(chains: [${chain}]) {
    address,
    chain,
    price
  }
}
`
  return queryAPI(query)
}

export function useTokenPrice(
  chainId: number,
  token: Token | undefined
): Price | undefined {
  const { isPending, data } = useQuery({
    queryKey: ['fetch-tokens-prices'],
    queryFn: () => fetchPrices(chainId)
  })

  if (!token) return
  if (isPending) return

    // if (error) console.log(error)
  return data.data.tokenGetCurrentPrices.find((p: any) => p.address === token.address)
}
