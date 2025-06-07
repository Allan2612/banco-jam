import { Currency } from "@/app/models/models"
interface CurrencyDisplayProps {
  amount: number
  currency: Currency | undefined
  className?: string
  showSign?: boolean
}

export function CurrencyDisplay({ amount, currency, className, showSign = false }: CurrencyDisplayProps) {
  const symbol = currency?.symbol || ""
  const sign = showSign && amount !== 0 ? (amount > 0 ? "+" : "-") : ""
  const displayAmount = Math.abs(amount)

  return (
    <span className={className}>
      {sign}
      {symbol}
      {displayAmount.toLocaleString()}
    </span>
  )
}
