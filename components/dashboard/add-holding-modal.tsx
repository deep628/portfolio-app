'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { stockData } from '@/lib/portfolio-store'

interface AddHoldingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddHolding: (data: {
    ticker: string
    quantity: number
    avgBuyPrice: number
    purchaseDate: string
  }) => void
}

export function AddHoldingModal({
  open,
  onOpenChange,
  onAddHolding,
}: AddHoldingModalProps) {
  const [ticker, setTicker] = useState('')
  const [quantity, setQuantity] = useState('')
  const [avgBuyPrice, setAvgBuyPrice] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const upperTicker = ticker.toUpperCase()
    if (!stockData[upperTicker]) {
      setError(`Stock "${upperTicker}" not found. Try AAPL, MSFT, GOOGL, etc.`)
      return
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Please enter a valid quantity')
      return
    }

    if (!avgBuyPrice || parseFloat(avgBuyPrice) <= 0) {
      setError('Please enter a valid average buy price')
      return
    }

    if (!purchaseDate) {
      setError('Please select a purchase date')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onAddHolding({
      ticker: upperTicker,
      quantity: parseFloat(quantity),
      avgBuyPrice: parseFloat(avgBuyPrice),
      purchaseDate,
    })

    // Reset form
    setTicker('')
    setQuantity('')
    setAvgBuyPrice('')
    setPurchaseDate('')
    setIsLoading(false)
    onOpenChange(false)
  }

  const stockInfo = ticker ? stockData[ticker.toUpperCase()] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Holding</DialogTitle>
          <DialogDescription>
            Enter the details of your stock purchase
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ticker">Ticker Symbol</FieldLabel>
              <Input
                id="ticker"
                placeholder="e.g., AAPL, MSFT"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="uppercase"
              />
              {stockInfo && (
                <p className="text-sm text-muted-foreground mt-1">
                  {stockInfo.name} - Current: ${stockInfo.currentPrice.toFixed(2)}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
              <Input
                id="quantity"
                type="number"
                placeholder="Number of shares"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="1"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="avgBuyPrice">Average Buy Price (USD)</FieldLabel>
              <Input
                id="avgBuyPrice"
                type="number"
                placeholder="Price per share in USD"
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="purchaseDate">Date of Purchase</FieldLabel>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </Field>
          </FieldGroup>

          {error && (
            <p className="text-sm text-negative">{error}</p>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner className="mr-2" /> : null}
              Add Holding
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
