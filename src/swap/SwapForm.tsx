import { useState, useEffect, useContext } from 'react'
import { useDebounce } from 'use-debounce'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

import AmountInfoIn from "./AmountInfoIn"
import AmountInfoOut from "./AmountInfoOut"
import { useChainId, useAccount } from 'wagmi'
import { useToken } from '../services/tokenService'
import { simulateSwap, swap } from "./swapService"
import { MessagesContext } from '../shared/MessagesProvider'
import SwitchIcon from '../assets/SwitchIcon'

export default function SwapForm() {
  const setMessages = useContext(MessagesContext).setMessages
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
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
    setLoading(false)
  }

  function handleSwitch() {
    setInTokenLabel(outTokenLabel)
    setOutTokenLabel(inTokenLabel)
    setAmount(0)
  }
  
  return (
    <>
      <div className="swap-container">
        <div className="swap-card">
          <div className="swap-header">
            <div>
              <h1 className="swap-title">Swap Tokens</h1>
              <p className="swap-subtitle">Exchange ETH and USDC</p>
            </div>
          </div>
          
          <AmountInfoIn chainId={chainId}
            token={inToken}
            amount={amount}
            onChange={setAmount} />
              
          <div className="swap-direction-btn-container">
            <button onClick={handleSwitch} className="swap-direction-btn"><SwitchIcon /></button>
          </div>
        
          <AmountInfoOut chainId={chainId}
            token={outToken}
            calculatedAmount={calculatedAmount} />

          <button onClick={handleSwap} disabled={(amount === 0) || loading} className="swap-button">
            {loading ? "Swapping..." : "Swap"}
          </button>
        </div>
      </div>
    </>
  )
}
