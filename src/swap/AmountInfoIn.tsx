import type { Token } from '@balancer/sdk'

import walletIcon from '../assets/wallet.png'
import { useTokenPrice } from '../services/tokenService'
import { formatCurrency } from '../services/currencyService'
import { useTokenBalance } from '../services/balanceService'

export default function AmountInfoIn(props: {
  chainId: number,
  token: Token | undefined,
  amount: number
  onChange: (amount: number) => void,
}) {
  const balance = useTokenBalance(props.chainId, props.token?.address)
  const priceImpact = useTokenPrice(props.chainId, props.token)
  const hasEnoughTokens = balance ? (Number(balance.formatted) - props.amount) > 0 : true

  return(
    <div className="amount-info">
      <div className="column">
        <input className="amount-input" type="number"
          value={props.amount}
          onChange={(e) => {  props.onChange(Number(e.target.value)) }} />
        
        <div className="currency">
          {formatCurrency(priceImpact ? priceImpact.price * props.amount : 0.0)}
        </div>
      </div>
      <div className="column">
        <div className="token">{props.token?.symbol}</div>
        <div className="wallet" title={hasEnoughTokens ? '' : 'Exceeds balance'}>
          <div className={`amount ${hasEnoughTokens ? '' : 'error-amount'}`}>{balance?.formatted}</div>
          <img src={walletIcon} className="small-icon" alt="Wallet amount"/>
        </div>
      </div>
    </div>
  )
}
