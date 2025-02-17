import { useAccount, useBalance } from 'wagmi'
import { getAddress, http, createPublicClient, formatEther } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { getChain } from './chainService'
import { useToken } from './tokenService'

export type TokenAmount = {
  value: bigint | undefined,
  decimals: number | undefined
  formatted: string | undefined
}

export async function fetchETHBalance(chainId: number | undefined, address: string | undefined) : Promise<bigint | undefined> {
  if (!chainId || !address) return
  
  const publicClient = createPublicClient({
    chain: getChain(chainId),
    transport: http(),
  })

  return publicClient.getBalance({ address: getAddress(address) })
}

function useETHBalance(chainId: number) : TokenAmount | undefined {
  const account = useAccount()

  const { isPending, data } = useQuery({
    queryKey: ['fetch-ETH-balance'],
    queryFn: () => fetchETHBalance(chainId, account.address)
  })

  if (isPending) return
  if (!data) return
  
  // if (error) console.log(error)

  return {
    value: data,
    decimals: 18,
    formatted: formatEther(data)
  }
}

export function useTokenBalance(chainId: number, token: string | undefined) : TokenAmount | undefined {
  const ethToken = useToken(chainId, 'ETH')
  const ethBalance = useETHBalance(chainId)
  const account = useAccount()
  const tokenAddress = token ? getAddress(token) : undefined
  
  const balance = useBalance({
    address: account.address,
    chainId: chainId,
    token: tokenAddress
  })

  if (!balance) return

  if (ethToken?.address === token) return ethBalance

  return {
    value: balance.data?.value,
    decimals: balance.data?.decimals,
    formatted: balance.data?.formatted
  }
}

