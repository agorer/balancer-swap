import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import AmountInfoIn from "./AmountInfoIn"
import AmountInfoOut from "./AmountInfoOut"
import switchIcon from '../assets/switch.png'
import { useChainId, useAccount } from 'wagmi'
import { useToken } from '../services/tokenService'
import { simulateSwap, swap } from "./swapService"

export default function SwapForm() {
  const account = useAccount()
  const chainId = useChainId()
  const inToken = useToken(chainId, 'ETH')
  const outToken = useToken(chainId, 'USDC')

  const [ amount, setAmount ] = useState(0)
  const [ debouncedAmount ] = useDebounce(amount, 500);
  const [ calculatedAmount, setCalculatedAmount ] = useState(0)

  async function handleAmountChange(amount: number) {
    const newCalculatedAmount = await simulateSwap(chainId, inToken, outToken, amount)
    setCalculatedAmount(newCalculatedAmount)
  }

  useEffect(() => { handleAmountChange(debouncedAmount) }, [debouncedAmount])

  async function handleSwap() {
    const receivedAmount = await swap(account.address, chainId, inToken, outToken, amount)

    alert(`You have received ${receivedAmount?.toSignificant(6)} ${outToken?.symbol}`)
  }
  
  return (
    <>
      <div className="swap-form">
        <AmountInfoIn chainId={chainId}
          token={inToken}
          amount={amount}
          onChange={setAmount} />
          
        <img src={switchIcon} className="medium-icon" />
        
        <AmountInfoOut chainId={chainId}
          token={outToken}
          calculatedAmount={calculatedAmount} />
      </div>
      
      <button onClick={ handleSwap }>Swap</button>
    </>
  )
}
