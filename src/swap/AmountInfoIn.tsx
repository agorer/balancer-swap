import type { Token } from '@balancer/sdk'

import walletIcon from '../assets/wallet.png'
import { useTokenPrice } from '../services/tokenService'
import { formatCurrency } from '../services/currencyService'
import { useTokenBalance } from '../services/balanceService'
import { getChainIcon } from '../services/chainService'

// FIXME: some problems with number formatting
// https://stackoverflow.com/questions/36883150/remove-zero-inside-input-when-try-to-erase

export default function AmountInfoIn(props: {
  chainId: number,
  token: Token | undefined,
  amount: number
  onChange: (amount: number) => void,
}) {
  const balance = useTokenBalance(props.chainId, props.token?.address)
  const priceImpact = useTokenPrice(props.chainId, props.token)
  const hasEnoughTokens = balance ? (Number(balance.formatted) - props.amount) > 0 : false
  const tokenLogo = getChainIcon(props.token?.symbol)

  function onAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    return props.onChange(Number(e.target.value))
  }

  return(
    <div className="token-section">
      <label className="token-label">From</label>
      <div className="token-input-group">
        <div className="token-container">
          <button className="token-selector-btn">
            <img src={ tokenLogo } alt={ props.token?.symbol } className="token-icon" />
            {props.token?.symbol}
          </button>
        </div>
        <input
          type="number"
          placeholder="0.0"
          value={ props.amount }
          onChange={ onAmountChange }
          className="token-amount-input"
        />
      </div>
      <div className="token-balance-display">
        <div className="balance-container">
          <div className="price-usd">
            {formatCurrency(priceImpact ? priceImpact.price * props.amount : 0.0)}
          </div>
          <div className="wallet balance-amount" title={hasEnoughTokens ? '' : 'Exceeds balance'}>
            <div className={`amount ${hasEnoughTokens ? '' : 'error-amount'}`}>{balance?.formatted}</div>
            <img src={walletIcon} className="small-icon" alt="Wallet amount"/>
          </div>
        </div>
      </div>
    </div>
  )
}
