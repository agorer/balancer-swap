import { Token } from '@balancer/sdk'

import walletIcon from '../assets/wallet.png'
import { useTokenPrice } from '../services/tokenService'
import { formatCurrency } from '../services/currencyService'
import { useTokenBalance } from '../services/balanceService'

export default function AmountInfoOut(props: {
  chainId: number,
  token: Token | undefined,
  calculatedAmount: number
}) {
  const balance = useTokenBalance(props.chainId, props.token?.address)
  const priceImpact = useTokenPrice(props.chainId, props.token)
  const price = priceImpact ? priceImpact.price * props.calculatedAmount : 0.0
  
  return(
    <div className="amount-info">
      <div className="column">
        { props.calculatedAmount }
        
        <div className="currency">
          {formatCurrency(price)}
        </div>
      </div>
      <div className="column">
        <div className="token">{props.token?.symbol}</div>
        <div className="wallet">
          <div className="amount">{balance?.formatted}</div>
          <img src={walletIcon} className="small-icon" alt="Wallet amount"/>
        </div>
      </div>
    </div>
  )
}
