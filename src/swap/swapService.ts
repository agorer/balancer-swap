import {
  getAddress,
  createWalletClient,
  custom,
  createPublicClient,
  http, 
  TransactionExecutionError} from "viem"
import {
  SwapKind,
  Token,
  TokenAmount,
  Swap,
  ExactInQueryOutput,
  Slippage,
  SwapBuildOutputExactIn
} from "@balancer/sdk"

import * as E from 'fp-ts/Either'

import { getChain } from '../services/chainService'
import { buildBalancerClient } from "../services/balancerApi"

const NEVER = 999999999999999999n

export async function simulateSwap(
  chainId: number,
  inToken: Token | undefined,
  outToken: Token | undefined,
  amount: number
): Promise<E.Either<string, number>> {
  if (!chainId || !inToken || !outToken || !amount) return E.right(0)
  
  const balancerApi = buildBalancerClient(chainId)

  const swapKind = SwapKind.GivenIn

  const paths = await balancerApi.sorSwapPaths.fetchSorSwapPaths({
    chainId,
    tokenIn: getAddress(inToken.address),
    tokenOut: getAddress(outToken.address),
    swapKind,
    swapAmount: TokenAmount.fromHumanAmount(inToken, `${amount}`)
  })

  if (paths.length === 0) return E.left('Unable to simulate (missing paths)')

  const swap = new Swap({ chainId, paths, swapKind })
  const simulatedResult = await swap.query() as ExactInQueryOutput

  return E.right(Number(simulatedResult.expectedAmountOut.toSignificant()))
}

export async function swap(
  userAddress: string | undefined,
  chainId: number,
  inToken: Token | undefined,
  outToken: Token | undefined,
  amount: number
) : Promise<E.Either<string, TokenAmount>> {

  if (!userAddress || !inToken || !outToken || !amount) return E.left('Unable to swap (missing parameters)')
  
  const balancerApi = buildBalancerClient(chainId)

  const swapKind = SwapKind.GivenIn

  const paths = await balancerApi.sorSwapPaths.fetchSorSwapPaths({
    chainId,
    tokenIn: getAddress(inToken.address),
    tokenOut: getAddress(outToken.address),
    swapKind,
    swapAmount: TokenAmount.fromHumanAmount(inToken, `${amount}`)
  })

  if (paths.length === 0) return E.left('Unable to swap (no paths found)')

  const swap = new Swap({ chainId, paths, swapKind })
  const simulatedResult = await swap.query() as ExactInQueryOutput
    
  const slippage = Slippage.fromPercentage("5")

  const swapParameters = swap.protocolVersion === 2 ? {
    slippage,
    deadline: NEVER,
    queryOutput: simulatedResult,
    wethIsEth: true,
    sender: userAddress,
    recipient: userAddress
  } : {
    slippage,
    deadline: NEVER,
    queryOutput: simulatedResult,
    wethIsEth: true
  }

  const txParams = swap.buildCall(swapParameters) as SwapBuildOutputExactIn

  const walletClient = createWalletClient({
    chain: getChain(chainId),
    transport: custom(window.ethereum!)
  })

  try {
    const txHash = await walletClient.sendTransaction({
      account: getAddress(userAddress),
      data: txParams.callData,
      to: txParams.to,
      value: txParams.value
    })

    const publicClient = createPublicClient({
      chain: getChain(chainId),
      transport: http(),
    })
    const txReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

    if (txReceipt.status === 'reverted') return E.left('Unable to swap (transaction reverted)')

    return E.right(txParams.minAmountOut)
  } catch (e) {
    const error = e as TransactionExecutionError
    return E.left(error.cause.shortMessage)
  }
}
