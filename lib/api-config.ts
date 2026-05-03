/**
 * API Configuration - US Market Only
 * 
 * This file centralizes all API-related configuration and environment variables.
 * All sensitive keys are server-side only and never exposed to the client.
 */

// ============================================
// Server-side only (never exposed to browser)
// ============================================

/**
 * Vercel AI Gateway API Key
 * Used for: AI-powered rebalancing and stock research
 * Set via: AI_GATEWAY_API_KEY environment variable
 */
export const getAIGatewayKey = () => process.env.AI_GATEWAY_API_KEY

/**
 * NewsAPI Key
 * Used for: Fetching financial news
 * Set via: NEWSAPI_KEY environment variable
 */
export const getNewsAPIKey = () => process.env.NEWSAPI_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY

/**
 * Finnhub API Key (optional, currently using Yahoo Finance)
 * Used for: Alternative stock data source
 * Set via: FINNHUB_KEY environment variable
 */
export const getFinnhubKey = () => process.env.FINNHUB_KEY || process.env.NEXT_PUBLIC_FINNHUB_KEY

// ============================================
// API Endpoints
// ============================================

export const API_ENDPOINTS = {
  // Yahoo Finance (free, no API key required)
  YAHOO_FINANCE_CHART: 'https://query1.finance.yahoo.com/v8/finance/chart',
  YAHOO_FINANCE_QUOTE_SUMMARY: 'https://query1.finance.yahoo.com/v10/finance/quoteSummary',
  
  // NewsAPI
  NEWS_API: 'https://newsapi.org/v2/everything',
  
  // Finnhub (if enabled)
  FINNHUB_QUOTE: 'https://finnhub.io/api/v1/quote',
  FINNHUB_PROFILE: 'https://finnhub.io/api/v1/stock/profile2',
} as const

// ============================================
// AI Model Configuration
// ============================================

export const AI_CONFIG = {
  // Default model for all AI calls
  DEFAULT_MODEL: 'anthropic/claude-sonnet-4-20250514',
  
  // Maximum duration for AI requests (in seconds)
  MAX_DURATION: 60,
} as const

// ============================================
// US Market Configuration
// ============================================

// US Market indices
export const MARKET_INDICES = {
  SP500: { symbol: '^GSPC', name: 'S&P 500' },
  DOW: { symbol: '^DJI', name: 'Dow Jones' },
  NASDAQ: { symbol: '^IXIC', name: 'NASDAQ' },
} as const

/**
 * Get the Yahoo Finance symbol for a US ticker (no suffix needed)
 */
export function getYahooSymbol(ticker: string): string {
  return ticker.toUpperCase()
}
