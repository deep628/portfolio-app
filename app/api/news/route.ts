import { NextRequest, NextResponse } from 'next/server'
import { getNewsAPIKey, API_ENDPOINTS } from '@/lib/api-config'

export const dynamic = 'force-dynamic'

interface NewsAPIArticle {
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  source: {
    name: string
  }
  author: string | null
}

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

// Simple sentiment analysis based on keywords
function analyzeSentiment(title: string, description: string | null): 'positive' | 'negative' | 'neutral' {
  const text = `${title} ${description || ''}`.toLowerCase()
  
  const positiveWords = [
    'surge', 'soar', 'jump', 'gain', 'rise', 'rally', 'boost', 'growth',
    'profit', 'beat', 'exceed', 'record', 'high', 'success', 'win', 'bullish',
    'upgrade', 'outperform', 'strong', 'positive', 'up', 'increase', 'boom'
  ]
  
  const negativeWords = [
    'fall', 'drop', 'decline', 'loss', 'crash', 'plunge', 'sink', 'tumble',
    'miss', 'fail', 'weak', 'bearish', 'downgrade', 'underperform', 'risk',
    'concern', 'warning', 'down', 'decrease', 'slump', 'crisis', 'fear'
  ]
  
  let score = 0
  positiveWords.forEach(word => {
    if (text.includes(word)) score += 1
  })
  negativeWords.forEach(word => {
    if (text.includes(word)) score -= 1
  })
  
  if (score > 0) return 'positive'
  if (score < 0) return 'negative'
  return 'neutral'
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tickers = searchParams.get('tickers')
  
  if (!tickers) {
    return NextResponse.json({ error: 'Tickers parameter required' }, { status: 400 })
  }

  // Use server-side env var for security
  const apiKey = getNewsAPIKey()
  
  if (!apiKey) {
    // Return mock data if no API key
    return NextResponse.json({
      articles: getMockNews(tickers.split(',')),
      source: 'mock'
    })
  }

  try {
    const tickerList = tickers.split(',')
    const allArticles: Array<{
      id: string
      headline: string
      summary: string
      source: string
      url: string
      publishedAt: string
      sentiment: 'positive' | 'negative' | 'neutral'
      tickers: string[]
      imageUrl: string | null
    }> = []

    // Fetch news for each ticker
    for (const ticker of tickerList.slice(0, 5)) { // Limit to 5 tickers to avoid rate limits
      const query = encodeURIComponent(`${ticker} stock (NYSE OR NASDAQ OR Wall Street OR market)`)
      const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PortfolioTracker/1.0'
        }
      })

      if (response.ok) {
        const data: NewsAPIResponse = await response.json()
        
        if (data.articles) {
          data.articles.forEach((article, index) => {
            // Avoid duplicates
            const existingIndex = allArticles.findIndex(a => a.headline === article.title)
            if (existingIndex === -1) {
              allArticles.push({
                id: `${ticker}-${index}-${Date.now()}`,
                headline: article.title,
                summary: article.description || 'No description available',
                source: article.source.name,
                url: article.url,
                publishedAt: article.publishedAt,
                sentiment: analyzeSentiment(article.title, article.description),
                tickers: [ticker],
                imageUrl: article.urlToImage
              })
            } else {
              // Add ticker to existing article
              if (!allArticles[existingIndex].tickers.includes(ticker)) {
                allArticles[existingIndex].tickers.push(ticker)
              }
            }
          })
        }
      }
    }

    // Sort by published date
    allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

    return NextResponse.json({
      articles: allArticles.slice(0, 30), // Limit to 30 articles
      source: 'newsapi'
    })

  } catch (error) {
    console.error('NewsAPI error:', error)
    return NextResponse.json({
      articles: getMockNews(tickers.split(',')),
      source: 'mock',
      error: 'Failed to fetch from NewsAPI'
    })
  }
}

function getMockNews(tickers: string[]) {
  const mockArticles = [
    {
      id: '1',
      headline: 'S&P 500 Hits New All-Time High as Tech Stocks Lead Rally',
      summary: 'The benchmark S&P 500 index surged to record levels driven by strong earnings from major tech companies and positive economic data.',
      source: 'Bloomberg',
      url: '#',
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive' as const,
      tickers: tickers.slice(0, 3),
      imageUrl: null
    },
    {
      id: '2',
      headline: 'Federal Reserve Holds Rates Steady, Signals Cautious Approach',
      summary: 'The Federal Reserve kept interest rates unchanged, citing persistent inflation concerns while acknowledging economic resilience.',
      source: 'CNBC',
      url: '#',
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      sentiment: 'neutral' as const,
      tickers: tickers.filter(t => ['JPM', 'BAC', 'GS', 'MS'].includes(t)),
      imageUrl: null
    },
    {
      id: '3',
      headline: 'Apple Reports Record iPhone Sales, Services Revenue Soars',
      summary: 'Apple Inc posted better-than-expected quarterly profits with iPhone and Services segments showing robust growth momentum.',
      source: 'Reuters',
      url: '#',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive' as const,
      tickers: ['AAPL'],
      imageUrl: null
    },
    {
      id: '4',
      headline: 'NVIDIA Secures $10 Billion AI Chip Order from Microsoft',
      summary: 'NVIDIA announced a major AI infrastructure deal with Microsoft, boosting semiconductor sector sentiment across the market.',
      source: 'Wall Street Journal',
      url: '#',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive' as const,
      tickers: ['NVDA', 'MSFT'],
      imageUrl: null
    },
    {
      id: '5',
      headline: 'Microsoft Cloud Revenue Surges 30% on AI Demand',
      summary: 'Microsoft reported a 30% year-on-year increase in cloud revenue driven by Azure growth and strong enterprise AI adoption.',
      source: 'Bloomberg',
      url: '#',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive' as const,
      tickers: ['MSFT'],
      imageUrl: null
    },
    {
      id: '6',
      headline: 'Amazon Faces Margin Pressure as Retail Competition Intensifies',
      summary: 'Amazon reported weaker-than-expected margins citing increased competition and higher logistics costs in the quarter.',
      source: 'Financial Times',
      url: '#',
      publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      sentiment: 'negative' as const,
      tickers: ['AMZN'],
      imageUrl: null
    },
    {
      id: '7',
      headline: 'Google Parent Alphabet Announces $70B Stock Buyback',
      summary: 'Alphabet announced a massive share repurchase program alongside strong ad revenue growth, sending shares higher in after-hours trading.',
      source: 'CNBC',
      url: '#',
      publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive' as const,
      tickers: ['GOOGL'],
      imageUrl: null
    },
    {
      id: '8',
      headline: 'Dow Jones Crosses 45,000 Mark Amid Global Rally',
      summary: 'The Dow Jones Industrial Average touched historic 45,000 level for the first time as positive economic data fuels market optimism.',
      source: 'MarketWatch',
      url: '#',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      sentiment: 'positive' as const,
      tickers: tickers.slice(0, 4),
      imageUrl: null
    }
  ]

  // Filter to show only articles with matching tickers, or show all if no matches
  const relevantArticles = mockArticles.filter(article => 
    article.tickers.some(t => tickers.includes(t)) || article.tickers.length === 0
  )

  return relevantArticles.length > 0 ? relevantArticles : mockArticles
}
