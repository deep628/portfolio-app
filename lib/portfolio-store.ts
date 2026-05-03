'use client'

export interface Holding {
  id: string
  ticker: string
  name: string
  quantity: number
  avgBuyPrice: number
  purchaseDate: string
  currentPrice: number
  sector: string
}

export interface PortfolioSummary {
  totalInvested: number
  currentValue: number
  totalPL: number
  totalPLPercent: number
  xirr: number
}

// US Stock data for lookup
export const stockData: Record<string, { name: string; sector: string; currentPrice: number }> = {
  AAPL: { name: 'Apple Inc.', sector: 'Technology', currentPrice: 178.85 },
  MSFT: { name: 'Microsoft Corporation', sector: 'Technology', currentPrice: 378.91 },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', currentPrice: 141.80 },
  AMZN: { name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', currentPrice: 178.25 },
  NVDA: { name: 'NVIDIA Corporation', sector: 'Technology', currentPrice: 875.38 },
  META: { name: 'Meta Platforms Inc.', sector: 'Technology', currentPrice: 505.75 },
  TSLA: { name: 'Tesla Inc.', sector: 'Consumer Discretionary', currentPrice: 248.50 },
  JPM: { name: 'JPMorgan Chase & Co.', sector: 'Financial Services', currentPrice: 195.42 },
  JNJ: { name: 'Johnson & Johnson', sector: 'Healthcare', currentPrice: 156.32 },
  V: { name: 'Visa Inc.', sector: 'Financial Services', currentPrice: 275.50 },
  PG: { name: 'Procter & Gamble Co.', sector: 'Consumer Staples', currentPrice: 162.85 },
  HD: { name: 'Home Depot Inc.', sector: 'Consumer Discretionary', currentPrice: 345.20 },
  UNH: { name: 'UnitedHealth Group Inc.', sector: 'Healthcare', currentPrice: 485.75 },
  BAC: { name: 'Bank of America Corp.', sector: 'Financial Services', currentPrice: 35.42 },
  XOM: { name: 'Exxon Mobil Corporation', sector: 'Energy', currentPrice: 104.27 },
  PFE: { name: 'Pfizer Inc.', sector: 'Healthcare', currentPrice: 28.45 },
  COST: { name: 'Costco Wholesale Corp.', sector: 'Consumer Staples', currentPrice: 725.80 },
  KO: { name: 'Coca-Cola Company', sector: 'Consumer Staples', currentPrice: 62.15 },
  WMT: { name: 'Walmart Inc.', sector: 'Consumer Staples', currentPrice: 165.30 },
  DIS: { name: 'Walt Disney Company', sector: 'Communication Services', currentPrice: 112.45 },
  NFLX: { name: 'Netflix Inc.', sector: 'Communication Services', currentPrice: 628.40 },
  INTC: { name: 'Intel Corporation', sector: 'Technology', currentPrice: 31.25 },
  AMD: { name: 'Advanced Micro Devices', sector: 'Technology', currentPrice: 158.30 },
  CRM: { name: 'Salesforce Inc.', sector: 'Technology', currentPrice: 265.80 },
  ADBE: { name: 'Adobe Inc.', sector: 'Technology', currentPrice: 485.60 },
  BRK_B: { name: 'Berkshire Hathaway Inc.', sector: 'Financial Services', currentPrice: 412.50 },
  LLY: { name: 'Eli Lilly and Company', sector: 'Healthcare', currentPrice: 785.30 },
  AVGO: { name: 'Broadcom Inc.', sector: 'Technology', currentPrice: 1245.60 },
  MA: { name: 'Mastercard Inc.', sector: 'Financial Services', currentPrice: 458.90 },
  ABBV: { name: 'AbbVie Inc.', sector: 'Healthcare', currentPrice: 168.45 },
}

// Default holdings for demo (US stocks)
export const defaultHoldings: Holding[] = [
  {
    id: '1',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    quantity: 50,
    avgBuyPrice: 145.00,
    purchaseDate: '2024-01-15',
    currentPrice: 178.85,
    sector: 'Technology',
  },
  {
    id: '2',
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    quantity: 30,
    avgBuyPrice: 320.50,
    purchaseDate: '2024-03-20',
    currentPrice: 378.91,
    sector: 'Technology',
  },
  {
    id: '3',
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 40,
    avgBuyPrice: 125.00,
    purchaseDate: '2024-02-10',
    currentPrice: 141.80,
    sector: 'Technology',
  },
  {
    id: '4',
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    quantity: 15,
    avgBuyPrice: 450.00,
    purchaseDate: '2023-11-05',
    currentPrice: 875.38,
    sector: 'Technology',
  },
  {
    id: '5',
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    quantity: 25,
    avgBuyPrice: 165.00,
    purchaseDate: '2024-04-01',
    currentPrice: 195.42,
    sector: 'Financial Services',
  },
  {
    id: '6',
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    quantity: 20,
    avgBuyPrice: 155.00,
    purchaseDate: '2024-05-15',
    currentPrice: 178.25,
    sector: 'Consumer Discretionary',
  },
]

// localStorage key
const STORAGE_KEY = 'portfolio_holdings_us'

// Get holdings from localStorage
export function getHoldings(): Holding[] {
  if (typeof window === 'undefined') return defaultHoldings
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultHoldings))
    return defaultHoldings
  }
  
  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultHoldings))
      return defaultHoldings
    }
    return parsed
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultHoldings))
    return defaultHoldings
  }
}

// Save holdings to localStorage
export function saveHoldings(holdings: Holding[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings))
}

// Add a new holding
// BUG 5 FIX: no longer silently returns null for unknown tickers
// falls back to placeholder data so any valid US ticker can be added
export function addHolding(holding: Omit<Holding, 'id' | 'name' | 'currentPrice' | 'sector'>): Holding {
  const upperTicker = holding.ticker.toUpperCase()
  const knownStock = stockData[upperTicker]
  
  // Use known data if available, otherwise create placeholder
  // Real price will be fetched and updated by useStockPrices hook on next refresh
  const stock = knownStock || {
    name: upperTicker,
    sector: 'Unknown',
    currentPrice: holding.avgBuyPrice,
  }
  
  const newHolding: Holding = {
    ...holding,
    id: Date.now().toString(),
    ticker: upperTicker,
    name: stock.name,
    currentPrice: stock.currentPrice,
    sector: stock.sector,
  }
  
  const holdings = getHoldings()
  
  // Check if ticker already exists
  const existingIndex = holdings.findIndex(h => h.ticker === newHolding.ticker)
  if (existingIndex >= 0) {
    // Average out the cost
    const existing = holdings[existingIndex]
    const totalShares = existing.quantity + newHolding.quantity
    const totalCost = (existing.quantity * existing.avgBuyPrice) + (newHolding.quantity * newHolding.avgBuyPrice)
    holdings[existingIndex] = {
      ...existing,
      quantity: totalShares,
      avgBuyPrice: totalCost / totalShares,
    }
    saveHoldings(holdings)
    return holdings[existingIndex]
  }
  
  holdings.push(newHolding)
  saveHoldings(holdings)
  return newHolding
}

// Remove a holding
export function removeHolding(id: string): void {
  const holdings = getHoldings().filter(h => h.id !== id)
  saveHoldings(holdings)
}

// Reset to default holdings
export function resetToDefaults(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultHoldings))
}

// Calculate XIRR (Internal Rate of Return)
export function calculateXIRR(holdings: Holding[]): number {
  if (holdings.length === 0) return 0
  
  // Create cash flows: negative for purchases, positive for current value
  const cashFlows: { amount: number; date: Date }[] = []
  
  holdings.forEach(holding => {
    // Purchase (negative cash flow)
    cashFlows.push({
      amount: -(holding.quantity * holding.avgBuyPrice),
      date: new Date(holding.purchaseDate),
    })
  })
  
  // Current value (positive cash flow - today)
  const totalCurrentValue = holdings.reduce(
    (sum, h) => sum + h.quantity * h.currentPrice,
    0
  )
  cashFlows.push({
    amount: totalCurrentValue,
    date: new Date(),
  })
  
  // Newton-Raphson method to find XIRR
  const daysBetween = (d1: Date, d2: Date) => 
    (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
  
  const firstDate = cashFlows.reduce(
    (min, cf) => cf.date < min ? cf.date : min,
    cashFlows[0].date
  )
  
  const npv = (rate: number) => {
    return cashFlows.reduce((sum, cf) => {
      const years = daysBetween(firstDate, cf.date) / 365
      return sum + cf.amount / Math.pow(1 + rate, years)
    }, 0)
  }
  
  const npvDerivative = (rate: number) => {
    return cashFlows.reduce((sum, cf) => {
      const years = daysBetween(firstDate, cf.date) / 365
      return sum - (years * cf.amount) / Math.pow(1 + rate, years + 1)
    }, 0)
  }
  
  let rate = 0.1 // Initial guess: 10%
  for (let i = 0; i < 100; i++) {
    const value = npv(rate)
    const derivative = npvDerivative(rate)
    
    if (Math.abs(derivative) < 1e-10) break
    
    const newRate = rate - value / derivative
    
    if (Math.abs(newRate - rate) < 1e-7) {
      rate = newRate
      break
    }
    
    rate = newRate
  }
  
  return rate * 100 // Return as percentage
}

// Calculate portfolio summary (in USD)
export function calculatePortfolioSummary(holdings: Holding[]): PortfolioSummary {
  const totalInvested = holdings.reduce(
    (sum, h) => sum + h.quantity * h.avgBuyPrice,
    0
  )
  
  const currentValue = holdings.reduce(
    (sum, h) => sum + h.quantity * h.currentPrice,
    0
  )
  
  const totalPL = currentValue - totalInvested
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0
  const xirr = calculateXIRR(holdings)
  
  return {
    totalInvested,
    currentValue,
    totalPL,
    totalPLPercent,
    xirr,
  }
}

// Format currency in USD
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format currency with decimals
export function formatUSDWithDecimals(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
