import * as chains from 'viem/chains'
import usdcIcon from '../assets/usdc-icon.png'
import ethIcon from '../assets/eth-icon.png'

export function getChain(chainId: number) {
  for (const chain of Object.values(chains)) {
    if (chain.id === chainId) {
      return chain;
    }
  }

  throw new Error(`Chain with id ${chainId} not found`);
}

export function getChainIcon(symbol: string | undefined) : string | undefined {
  if (symbol === 'USDC') return usdcIcon
  if (symbol === 'ETH') return ethIcon

  return
}
