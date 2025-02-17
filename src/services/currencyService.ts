import type { TokenAmount } from "../services/balanceService"

export function formatCurrency(amount: number) {
  return '$' + Math.round(amount * 100) / 100
}
