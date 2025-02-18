import { useState, useEffect, useContext } from 'react'
import { useDebounce } from 'use-debounce'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

import AmountInfoIn from "./AmountInfoIn"
import AmountInfoOut from "./AmountInfoOut"
import switchIcon from '../assets/switch.png'
import { useChainId, useAccount } from 'wagmi'
import { useToken } from '../services/tokenService'
import { simulateSwap, swap } from "./swapService"
import { MessagesContext } from '../shared/MessagesProvider'

export default function SwapForm() {
  const setMessages = useContext(MessagesContext).setMessages
  const account = useAccount()
  const chainId = useChainId()
  const [ inTokenLabel, setInTokenLabel ] = useState('ETH')
  const [ outTokenLabel, setOutTokenLabel ] = useState('USDC')
  const inToken = useToken(chainId, inTokenLabel)
  const outToken = useToken(chainId, outTokenLabel)

  const [ amount, setAmount ] = useState(0)
  const [ debouncedAmount ] = useDebounce(amount, 500);
  const [ calculatedAmount, setCalculatedAmount ] = useState(0)

  async function handleAmountChange(amount: number) {
    const simulationResult = await simulateSwap(chainId, inToken, outToken, amount)
    pipe(simulationResult,
      E.match(
        (errorMessage) => setMessages({ error: errorMessage, info: '' }),
        (newCalculatedAmount) => setCalculatedAmount(newCalculatedAmount)
      )
    )
  }

  useEffect(() => { handleAmountChange(debouncedAmount) }, [debouncedAmount])

  async function handleSwap() {
    const result = await swap(account.address, chainId, inToken, outToken, amount)
    pipe(result,
      E.match(
        (errorMessage) => setMessages({ error: errorMessage, info: '' }),
        (receivedAmount) => {
          const successMessage = `You have received ${receivedAmount?.toSignificant(6)} ${outToken?.symbol}`
          setMessages({ error: '', info: successMessage })
          setAmount(0)
        }
      )
    )
  }

  function handleSwitch() {
    setInTokenLabel(outTokenLabel)
    setOutTokenLabel(inTokenLabel)
    setAmount(0)
  }
  
  return (
    <>
      <div className="swap-form">
        <AmountInfoIn chainId={chainId}
          token={inToken}
          amount={amount}
          onChange={setAmount} />
          
        <img src={switchIcon} className="medium-icon clickable" onClick={ handleSwitch } />
        
        <AmountInfoOut chainId={chainId}
          token={outToken}
          calculatedAmount={calculatedAmount} />
      </div>

      <div className ="footer">
        <button onClick={ handleSwap }>Swap</button>
      </div>
    </>
  )
}
