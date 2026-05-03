import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'
import type { StockInfo } from '../stock-info/route'
import { getAIGatewayKey, AI_CONFIG } from '@/lib/api-config'

export const maxDuration = AI_CONFIG.MAX_DURATION

const SYSTEM_PROMPT = `You are an expert US equity analyst who evaluates stocks using a rigorous 7-point framework. For each stock, analyze and score these parameters (1-10 scale):

1. **Cyclicality** (1-10): How sensitive is the business to economic cycles? Higher score = less cyclical, more defensive.
2. **Moat** (1-10): Competitive advantages - brand, network effects, switching costs, patents, cost advantages. Higher = stronger moat.
3. **Cash Flow** (1-10): Quality and consistency of free cash flow generation. Higher = better cash flow.
4. **Governance** (1-10): Management quality, executive integrity, insider transactions, board independence. Higher = better governance.
5. **Capital Allocation** (1-10): How well does management deploy capital? ROE, ROIC trends, dividend policy, buybacks. Higher = better allocation.
6. **Valuation** (1-10): Is the stock fairly priced relative to growth and quality? Higher = more attractive valuation.
7. **Ownership Quality** (1-10): Institutional holdings, insider ownership, hedge fund support. Higher = better ownership.

IMPORTANT: You MUST format your response EXACTLY as follows:

## Stock Analysis: [TICKER]
**Company:** [Full company name]
**Sector:** [Sector]
**Current Price:** $[Price]

## Checklist Scores

| Parameter | Score | Assessment |
|-----------|-------|------------|
| Cyclicality | X/10 | [One line assessment] |
| Moat | X/10 | [One line assessment] |
| Cash Flow | X/10 | [One line assessment] |
| Governance | X/10 | [One line assessment] |
| Capital Allocation | X/10 | [One line assessment] |
| Valuation | X/10 | [One line assessment] |
| Ownership Quality | X/10 | [One line assessment] |
| **TOTAL** | **XX/70** | |

## Verdict
**Rating:** [BUY / HOLD / AVOID]
**Target Price Range:** $[Low] - $[High] (X-Y% upside/downside)
**Investment Horizon:** [6 months / 1 year / 2+ years]

## Key Strengths
- [Point 1]
- [Point 2]
- [Point 3]

## Key Risks
- [Point 1]
- [Point 2]
- [Point 3]

## Summary
[2-3 sentences summarizing the investment thesis]

Be data-driven using the provided financials. Use US Dollars ($) for all values.`

export async function POST(req: Request) {
  const aiGatewayKey = getAIGatewayKey()

  if (!aiGatewayKey) {
    return NextResponse.json(
      { error: 'AI Gateway key not configured. Add AI_GATEWAY_KEY to your Vercel environment variables.' },
      { status: 500 }
    )
  }

  const { stockInfo }: { stockInfo: StockInfo } = await req.json()

  const formatLargeNumber = (num: number | undefined) => {
    if (!num) return 'N/A'
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  const financialContext = `
Analyze this stock and provide the 7-point framework analysis:

Ticker: ${stockInfo.ticker}
Company: ${stockInfo.name}
Price: $${stockInfo.price?.toFixed(2) || 'N/A'}
Change: ${stockInfo.changePercent?.toFixed(2) || 'N/A'}%
Exchange: ${stockInfo.exchange}
Sector: ${stockInfo.sector}
Industry: ${stockInfo.industry}
Market Cap: ${formatLargeNumber(stockInfo.marketCap)}
52-Week High: $${stockInfo.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}
52-Week Low: $${stockInfo.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}
Beta: ${stockInfo.beta?.toFixed(2) || 'N/A'}
P/E (TTM): ${stockInfo.trailingPE?.toFixed(2) || 'N/A'}
Forward P/E: ${stockInfo.forwardPE?.toFixed(2) || 'N/A'}
P/B: ${stockInfo.priceToBook?.toFixed(2) || 'N/A'}
P/S: ${stockInfo.priceToSales?.toFixed(2) || 'N/A'}
EV: ${formatLargeNumber(stockInfo.enterpriseValue)}
Profit Margin: ${stockInfo.profitMargin?.toFixed(2) || 'N/A'}%
Operating Margin: ${stockInfo.operatingMargin?.toFixed(2) || 'N/A'}%
ROE: ${stockInfo.returnOnEquity?.toFixed(2) || 'N/A'}%
ROA: ${stockInfo.returnOnAssets?.toFixed(2) || 'N/A'}%
Revenue Growth: ${stockInfo.revenueGrowth?.toFixed(2) || 'N/A'}%
EPS: $${stockInfo.eps?.toFixed(2) || 'N/A'}
Debt/Equity: ${stockInfo.debtToEquity?.toFixed(2) || 'N/A'}
Current Ratio: ${stockInfo.currentRatio?.toFixed(2) || 'N/A'}
Free Cash Flow: ${formatLargeNumber(stockInfo.freeCashFlow)}
Total Cash: ${formatLargeNumber(stockInfo.totalCash)}
Total Debt: ${formatLargeNumber(stockInfo.totalDebt)}
Dividend Yield: ${stockInfo.dividendYield?.toFixed(2) || 'N/A'}%
Analyst Target (Mean): $${stockInfo.targetMeanPrice?.toFixed(2) || 'N/A'}
Analyst Target (High): $${stockInfo.targetHighPrice?.toFixed(2) || 'N/A'}
Analyst Target (Low): $${stockInfo.targetLowPrice?.toFixed(2) || 'N/A'}
Number of Analysts: ${stockInfo.numberOfAnalysts || 'N/A'}
Recommendation: ${stockInfo.recommendationKey || 'N/A'}
`

  const gateway = createOpenAI({
    apiKey: aiGatewayKey,
    baseURL: 'https://ai-gateway.vercel.sh/v1',
  })

  // Use messages array (not prompt string) for reliable streaming
  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4-20250514'),
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: financialContext }],
    abortSignal: req.signal,
  })

  // Return as plain text stream — simplest and most reliable for the client
  return new Response(result.textStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
