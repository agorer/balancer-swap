import { Token } from '@balancer/sdk'

import walletIcon from '../assets/wallet.png'
import { useTokenPrice } from '../services/tokenService'
import { formatCurrency } from '../services/currencyService'
import { useTokenBalance } from '../services/balanceService'
import { getChainIcon } from '../services/chainService'

export default function AmountInfoOut(props: {
  chainId: number,
  token: Token | undefined,
  calculatedAmount: number
}) {
  const balance = useTokenBalance(props.chainId, props.token?.address)
  const priceImpact = useTokenPrice(props.chainId, props.token)
  const price = priceImpact ? priceImpact.price * props.calculatedAmount : 0.0
  const tokenLogo = getChainIcon(props.token?.symbol)
  
  return(
    <div className="token-section">
      <label className="token-label">To</label>
      <div className="token-input-group">
        <div className="token-dropdown-container">
          <button className="token-selector-btn">
            <img src={ tokenLogo } alt={ props.token?.symbol } className="token-icon" />
            {props.token?.symbol}
          </button>
        </div>
        <input
          type="number"
          placeholder="0.0"
          value={ props.calculatedAmount }
          readOnly
          className="token-amount-input readonly"
        />
      </div>
      <div className="token-balance-display">
        <div className="balance-container">
          <div className="price-usd">
            {formatCurrency(price)}
          </div>
          <div className="wallet balance-amount">
            <div className="amount">{balance?.formatted}</div>
            <img src={walletIcon} className="small-icon" alt="Wallet amount"/>
          </div>
        </div>
      </div>
    </div>
  )
}
