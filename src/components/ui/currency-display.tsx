interface CurrencyDisplayProps {
  amount: number
  currency: string
  className?: string
  showSign?: boolean
}

export function CurrencyDisplay({ amount, currency, className, showSign = false }: CurrencyDisplayProps) {
  const symbol = currency === "USD" ? "$" : "₡"
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
