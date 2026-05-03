export interface Stock {
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  change: number
  changePercent: number
  sector: string
  marketCap: string
  peRatio: number
  dividend: number
  volume: number
  dayHigh: number
  dayLow: number
  yearHigh: number
  yearLow: number
}

export interface AnalystRating {
  firm: string
  analyst: string
  rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell'
  priceTarget: number
  previousTarget: number
  date: string
  summary: string
}

export interface StockNews {
  id: string
  headline: string
  source: string
  timestamp: Date
  sentiment: 'positive' | 'neutral' | 'negative'
  summary: string
  url: string
}

export interface FundamentalData {
  symbol: string
  revenue: number
  revenueGrowth: number
  netIncome: number
  netIncomeGrowth: number
  eps: number
  epsGrowth: number
  grossMargin: number
  operatingMargin: number
  netMargin: number
  roe: number
  roa: number
  debtToEquity: number
  currentRatio: number
  freeCashFlow: number
  bookValue: number
  priceToBook: number
  priceToSales: number
  beta: number
}

export interface PriceTarget {
  symbol: string
  currentPrice: number
  averageTarget: number
  highTarget: number
  lowTarget: number
  numberOfAnalysts: number
  strongBuy: number
  buy: number
  hold: number
  sell: number
  strongSell: number
}

export interface AssetAllocation {
  sector: string
  value: number
  target: number
  color: string
}

export interface Alert {
  id: string
  type: 'price' | 'volume' | 'rebalance' | 'news'
  symbol: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

export interface PortfolioPerformance {
  date: string
  value: number
  benchmark: number
}

// Mock portfolio holdings
export const portfolioHoldings: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 50,
    avgCost: 145.20,
    currentPrice: 178.85,
    change: 2.35,
    changePercent: 1.33,
    sector: 'Technology',
    marketCap: '2.8T',
    peRatio: 28.5,
    dividend: 0.96,
    volume: 52_340_000,
    dayHigh: 180.10,
    dayLow: 176.50,
    yearHigh: 199.62,
    yearLow: 164.08,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    shares: 35,
    avgCost: 310.50,
    currentPrice: 378.91,
    change: -1.24,
    changePercent: -0.33,
    sector: 'Technology',
    marketCap: '2.81T',
    peRatio: 35.2,
    dividend: 2.72,
    volume: 18_420_000,
    dayHigh: 381.50,
    dayLow: 376.20,
    yearHigh: 420.82,
    yearLow: 309.45,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 25,
    avgCost: 125.80,
    currentPrice: 141.80,
    change: 3.45,
    changePercent: 2.49,
    sector: 'Technology',
    marketCap: '1.78T',
    peRatio: 25.8,
    dividend: 0,
    volume: 24_150_000,
    dayHigh: 143.20,
    dayLow: 139.80,
    yearHigh: 153.78,
    yearLow: 115.83,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    shares: 40,
    avgCost: 142.30,
    currentPrice: 195.42,
    change: 1.87,
    changePercent: 0.97,
    sector: 'Financial',
    marketCap: '565B',
    peRatio: 11.2,
    dividend: 4.60,
    volume: 8_920_000,
    dayHigh: 197.10,
    dayLow: 193.80,
    yearHigh: 205.88,
    yearLow: 135.19,
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    shares: 30,
    avgCost: 162.45,
    currentPrice: 156.32,
    change: -0.68,
    changePercent: -0.43,
    sector: 'Healthcare',
    marketCap: '375B',
    peRatio: 15.8,
    dividend: 4.76,
    volume: 6_340_000,
    dayHigh: 158.20,
    dayLow: 155.10,
    yearHigh: 175.97,
    yearLow: 143.13,
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil',
    shares: 45,
    avgCost: 95.80,
    currentPrice: 104.27,
    change: 0.92,
    changePercent: 0.89,
    sector: 'Energy',
    marketCap: '416B',
    peRatio: 12.4,
    dividend: 3.80,
    volume: 14_280_000,
    dayHigh: 105.50,
    dayLow: 103.20,
    yearHigh: 120.70,
    yearLow: 95.77,
  },
  {
    symbol: 'PG',
    name: 'Procter & Gamble',
    shares: 25,
    avgCost: 148.20,
    currentPrice: 162.85,
    change: 0.45,
    changePercent: 0.28,
    sector: 'Consumer Staples',
    marketCap: '383B',
    peRatio: 24.6,
    dividend: 3.76,
    volume: 5_120_000,
    dayHigh: 164.10,
    dayLow: 161.90,
    yearHigh: 168.98,
    yearLow: 140.35,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    shares: 20,
    avgCost: 450.00,
    currentPrice: 875.38,
    change: 12.45,
    changePercent: 1.44,
    sector: 'Technology',
    marketCap: '2.16T',
    peRatio: 65.2,
    dividend: 0.16,
    volume: 42_680_000,
    dayHigh: 882.50,
    dayLow: 860.20,
    yearHigh: 974.94,
    yearLow: 393.05,
  },
]

// Asset allocation data
export const assetAllocation: AssetAllocation[] = [
  { sector: 'Technology', value: 48.2, target: 40, color: 'var(--chart-1)' },
  { sector: 'Financial', value: 12.8, target: 15, color: 'var(--chart-2)' },
  { sector: 'Healthcare', value: 7.6, target: 15, color: 'var(--chart-3)' },
  { sector: 'Energy', value: 7.4, target: 10, color: 'var(--chart-4)' },
  { sector: 'Consumer Staples', value: 6.5, target: 10, color: 'var(--chart-5)' },
  { sector: 'Cash', value: 17.5, target: 10, color: 'oklch(0.5 0 0)' },
]

// Portfolio performance over time
export const portfolioPerformance: PortfolioPerformance[] = [
  { date: 'Jan', value: 100000, benchmark: 100000 },
  { date: 'Feb', value: 103500, benchmark: 102000 },
  { date: 'Mar', value: 108200, benchmark: 105500 },
  { date: 'Apr', value: 105800, benchmark: 104200 },
  { date: 'May', value: 112400, benchmark: 108900 },
  { date: 'Jun', value: 118600, benchmark: 112400 },
  { date: 'Jul', value: 124200, benchmark: 115800 },
  { date: 'Aug', value: 121800, benchmark: 114200 },
  { date: 'Sep', value: 128500, benchmark: 118600 },
  { date: 'Oct', value: 135200, benchmark: 122400 },
  { date: 'Nov', value: 142800, benchmark: 126800 },
  { date: 'Dec', value: 148500, benchmark: 130200 },
]

// Alerts
export const initialAlerts: Alert[] = [
  {
    id: '1',
    type: 'price',
    symbol: 'NVDA',
    message: 'NVDA reached your target price of $875',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: 'high',
  },
  {
    id: '2',
    type: 'rebalance',
    symbol: 'TECH',
    message: 'Technology sector is 8.2% above target allocation',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: 'medium',
  },
  {
    id: '3',
    type: 'volume',
    symbol: 'GOOGL',
    message: 'Unusual volume detected: 2.5x average',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    priority: 'low',
  },
  {
    id: '4',
    type: 'news',
    symbol: 'AAPL',
    message: 'Apple announces new product event scheduled for next week',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    priority: 'medium',
  },
]

// Calculate portfolio totals
export function calculatePortfolioTotals(holdings: Stock[]) {
  const totalValue = holdings.reduce((sum, stock) => sum + stock.currentPrice * stock.shares, 0)
  const totalCost = holdings.reduce((sum, stock) => sum + stock.avgCost * stock.shares, 0)
  const totalGain = totalValue - totalCost
  const totalGainPercent = ((totalValue - totalCost) / totalCost) * 100
  const dayChange = holdings.reduce((sum, stock) => sum + stock.change * stock.shares, 0)
  const dayChangePercent = (dayChange / (totalValue - dayChange)) * 100

  return {
    totalValue,
    totalCost,
    totalGain,
    totalGainPercent,
    dayChange,
    dayChangePercent,
  }
}

// Calculate rebalancing recommendations
export function calculateRebalancing(holdings: Stock[], allocations: AssetAllocation[], totalValue: number) {
  return allocations.map((allocation) => {
    const currentValue = (allocation.value / 100) * totalValue
    const targetValue = (allocation.target / 100) * totalValue
    const difference = targetValue - currentValue
    const action = difference > 0 ? 'Buy' : difference < 0 ? 'Sell' : 'Hold'

    return {
      ...allocation,
      currentValue,
      targetValue,
      difference,
      action,
    }
  })
}

// Simulated stock search data
export const stockSearchResults = [
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', price: 178.25, change: 2.15 },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', price: 505.75, change: -3.42 },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', price: 248.50, change: 5.80 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', price: 158.30, change: 1.25 },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', price: 628.40, change: -2.10 },
]

// Analyst ratings by stock
export const analystRatings: Record<string, AnalystRating[]> = {
  AAPL: [
    {
      firm: 'Goldman Sachs',
      analyst: 'Michael Chen',
      rating: 'Buy',
      priceTarget: 210,
      previousTarget: 195,
      date: '2026-04-28',
      summary: 'We raise our price target on Apple to $210 following strong iPhone 17 pre-order data. Services growth continues to exceed expectations with 18% YoY growth. The Vision Pro 2 launch is expected to drive incremental revenue in FY26.',
    },
    {
      firm: 'Morgan Stanley',
      analyst: 'Erik Woodring',
      rating: 'Strong Buy',
      priceTarget: 220,
      previousTarget: 210,
      date: '2026-04-25',
      summary: 'Apple remains our top large-cap pick. We see continued strength in emerging markets and expect Services to reach $100B annual run rate by end of FY26.',
    },
    {
      firm: 'JP Morgan',
      analyst: 'Samik Chatterjee',
      rating: 'Buy',
      priceTarget: 205,
      previousTarget: 200,
      date: '2026-04-20',
      summary: 'Maintain Buy rating ahead of earnings. We expect beat-and-raise driven by strong Mac and iPad refresh cycle.',
    },
    {
      firm: 'Bank of America',
      analyst: 'Wamsi Mohan',
      rating: 'Hold',
      priceTarget: 185,
      previousTarget: 180,
      date: '2026-04-15',
      summary: 'While Apple continues to execute well, we see limited upside at current valuation. Wait for better entry point.',
    },
  ],
  MSFT: [
    {
      firm: 'Goldman Sachs',
      analyst: 'Kash Rangan',
      rating: 'Strong Buy',
      priceTarget: 450,
      previousTarget: 420,
      date: '2026-04-30',
      summary: 'Microsoft AI momentum is accelerating. Copilot adoption is exceeding our expectations with 45% of enterprise customers now using AI features. Azure growth remains robust at 32% YoY.',
    },
    {
      firm: 'Citi',
      analyst: 'Tyler Radke',
      rating: 'Buy',
      priceTarget: 430,
      previousTarget: 400,
      date: '2026-04-22',
      summary: 'We see continued upside from AI monetization. GitHub Copilot now has 5M paid subscribers, up from 1.5M a year ago.',
    },
    {
      firm: 'UBS',
      analyst: 'Karl Keirstead',
      rating: 'Buy',
      priceTarget: 420,
      previousTarget: 410,
      date: '2026-04-18',
      summary: 'Cloud fundamentals remain strong. Enterprise digital transformation spending shows no signs of slowing.',
    },
  ],
  NVDA: [
    {
      firm: 'Goldman Sachs',
      analyst: 'Toshiya Hari',
      rating: 'Strong Buy',
      priceTarget: 1100,
      previousTarget: 950,
      date: '2026-05-01',
      summary: 'NVIDIA remains the undisputed AI infrastructure leader. Blackwell demand continues to outpace supply by significant margin. We see data center revenue doubling again in FY27.',
    },
    {
      firm: 'Bernstein',
      analyst: 'Stacy Rasgon',
      rating: 'Strong Buy',
      priceTarget: 1050,
      previousTarget: 900,
      date: '2026-04-28',
      summary: 'AI training and inference demand shows no signs of peak. Sovereign AI investments globally will drive incremental billions in revenue.',
    },
    {
      firm: 'Wells Fargo',
      analyst: 'Aaron Rakers',
      rating: 'Buy',
      priceTarget: 980,
      previousTarget: 880,
      date: '2026-04-25',
      summary: 'Networking revenue from Spectrum-X is an underappreciated growth driver. Maintain Buy.',
    },
  ],
  GOOGL: [
    {
      firm: 'Goldman Sachs',
      analyst: 'Eric Sheridan',
      rating: 'Buy',
      priceTarget: 170,
      previousTarget: 155,
      date: '2026-04-27',
      summary: 'Google Search AI overviews are driving higher engagement and monetization. Cloud growth is accelerating with Gemini adoption. YouTube remains a secular winner in connected TV.',
    },
    {
      firm: 'Barclays',
      analyst: 'Ross Sandler',
      rating: 'Buy',
      priceTarget: 165,
      previousTarget: 150,
      date: '2026-04-22',
      summary: 'We see 20%+ EPS growth ahead driven by operating leverage and AI efficiency gains.',
    },
  ],
  JPM: [
    {
      firm: 'Goldman Sachs',
      analyst: 'Richard Ramsden',
      rating: 'Strong Buy',
      priceTarget: 230,
      previousTarget: 215,
      date: '2026-04-29',
      summary: 'JPMorgan continues to gain market share across all business lines. Net interest income outlook remains robust. Investment banking recovery is underway.',
    },
    {
      firm: 'Morgan Stanley',
      analyst: 'Betsy Graseck',
      rating: 'Buy',
      priceTarget: 220,
      previousTarget: 205,
      date: '2026-04-24',
      summary: 'Best-in-class management and technology investments position JPM for continued outperformance.',
    },
  ],
  JNJ: [
    {
      firm: 'Goldman Sachs',
      analyst: 'Chris Shibutani',
      rating: 'Hold',
      priceTarget: 165,
      previousTarget: 170,
      date: '2026-04-26',
      summary: 'We remain cautious on JNJ given ongoing litigation risks and patent cliffs. Innovative Medicine growth is solid but priced in at current levels.',
    },
    {
      firm: 'Jefferies',
      analyst: 'Akash Tewari',
      rating: 'Buy',
      priceTarget: 180,
      previousTarget: 175,
      date: '2026-04-20',
      summary: 'Pipeline developments are underappreciated. We see upside from oncology portfolio expansion.',
    },
  ],
  XOM: [
    {
      firm: 'Goldman Sachs',
      analyst: 'Neil Mehta',
      rating: 'Buy',
      priceTarget: 125,
      previousTarget: 115,
      date: '2026-04-28',
      summary: 'Exxon remains our top integrated oil pick. Permian Basin production continues to exceed expectations. Cost structure improvements are driving higher free cash flow.',
    },
    {
      firm: 'RBC Capital',
      analyst: 'Biraj Borkhataria',
      rating: 'Buy',
      priceTarget: 120,
      previousTarget: 110,
      date: '2026-04-22',
      summary: 'Low-carbon investments position XOM well for energy transition while maintaining strong returns.',
    },
  ],
  PG: [
    {
      firm: 'Goldman Sachs',
      analyst: 'Jason English',
      rating: 'Buy',
      priceTarget: 180,
      previousTarget: 175,
      date: '2026-04-25',
      summary: 'P&G continues to demonstrate pricing power across categories. Productivity improvements are funding brand investments. Organic growth outlook remains healthy.',
    },
    {
      firm: 'Deutsche Bank',
      analyst: 'Steve Powers',
      rating: 'Hold',
      priceTarget: 168,
      previousTarget: 165,
      date: '2026-04-20',
      summary: 'Solid execution but valuation is full. Prefer to wait for better entry point.',
    },
  ],
}

// Stock news by symbol
export const stockNews: Record<string, StockNews[]> = {
  AAPL: [
    {
      id: '1',
      headline: 'Apple Reports Record Q2 Revenue of $98.7 Billion, Beats Expectations',
      source: 'Bloomberg',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Apple Inc. reported fiscal Q2 revenue that exceeded analyst estimates, driven by strong iPhone and Services growth in emerging markets.',
      url: '#',
    },
    {
      id: '2',
      headline: 'Apple Vision Pro 2 Launch Set for September with Improved Display',
      source: 'Reuters',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Apple is preparing to launch Vision Pro 2 with micro-OLED displays and improved comfort features, according to supply chain sources.',
      url: '#',
    },
    {
      id: '3',
      headline: 'EU Regulators Approve Apple Pay Changes Following DMA Compliance',
      source: 'Financial Times',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      sentiment: 'neutral',
      summary: 'European Union regulators have approved Apples proposed changes to Apple Pay, allowing third-party access to NFC chip.',
      url: '#',
    },
    {
      id: '4',
      headline: 'Apple Expands AI Partnership with OpenAI for iOS 19 Features',
      source: 'The Verge',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Apple and OpenAI are deepening their partnership to bring more advanced AI features to iOS 19, including improved Siri capabilities.',
      url: '#',
    },
  ],
  MSFT: [
    {
      id: '1',
      headline: 'Microsoft Azure Revenue Grows 32% as AI Demand Accelerates',
      source: 'CNBC',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Microsofts cloud computing division reported strong growth driven by enterprise AI adoption and Copilot integration.',
      url: '#',
    },
    {
      id: '2',
      headline: 'Microsoft Copilot Reaches 5 Million Paid Subscribers',
      source: 'TechCrunch',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'GitHub Copilot has reached a major milestone with 5 million paid subscribers, more than tripling from last year.',
      url: '#',
    },
    {
      id: '3',
      headline: 'Microsoft Announces $10 Billion Investment in Southeast Asia Data Centers',
      source: 'Wall Street Journal',
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Microsoft will invest $10 billion to expand cloud infrastructure in Indonesia, Thailand, and Vietnam to meet growing AI demand.',
      url: '#',
    },
  ],
  NVDA: [
    {
      id: '1',
      headline: 'NVIDIA Blackwell GPUs See Unprecedented Demand from Hyperscalers',
      source: 'Bloomberg',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'NVIDIA CEO Jensen Huang confirmed that Blackwell GPU demand is significantly outpacing supply, with orders extending into 2027.',
      url: '#',
    },
    {
      id: '2',
      headline: 'Saudi Arabia Orders $5 Billion in NVIDIA AI Infrastructure',
      source: 'Reuters',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Saudi Arabias sovereign wealth fund has placed a massive order for NVIDIA AI chips as part of its Vision 2030 technology initiative.',
      url: '#',
    },
    {
      id: '3',
      headline: 'NVIDIA Spectrum-X Ethernet Platform Gains Traction in AI Data Centers',
      source: 'Data Center Dynamics',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'NVIDIAs Ethernet networking solution for AI is seeing rapid adoption as customers seek alternatives to InfiniBand.',
      url: '#',
    },
  ],
  GOOGL: [
    {
      id: '1',
      headline: 'Google Cloud Revenue Surges 28% on Gemini AI Adoption',
      source: 'CNBC',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Google Cloud division reported accelerating growth as enterprise customers adopt Gemini AI models for business applications.',
      url: '#',
    },
    {
      id: '2',
      headline: 'YouTube Reaches 100 Million Music Premium Subscribers',
      source: 'Variety',
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'YouTube Music and Premium combined subscribers hit 100 million milestone, cementing its position as a top streaming service.',
      url: '#',
    },
    {
      id: '3',
      headline: 'DOJ Antitrust Trial: Google Defends Search Market Position',
      source: 'Washington Post',
      timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000),
      sentiment: 'negative',
      summary: 'Google executives testified in ongoing antitrust trial, defending the companys search distribution agreements with device makers.',
      url: '#',
    },
  ],
  JPM: [
    {
      id: '1',
      headline: 'JPMorgan Reports Record Investment Banking Revenue in Q1',
      source: 'Bloomberg',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'JPMorgan Chase reported its best quarter for investment banking fees as IPO and M&A activity recovered strongly.',
      url: '#',
    },
    {
      id: '2',
      headline: 'Jamie Dimon Warns of Geopolitical Risks But Remains Optimistic on US Economy',
      source: 'Financial Times',
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
      sentiment: 'neutral',
      summary: 'JPMorgan CEO Jamie Dimon highlighted geopolitical concerns in annual letter while expressing confidence in US economic resilience.',
      url: '#',
    },
  ],
  JNJ: [
    {
      id: '1',
      headline: 'J&J Oncology Drug Receives FDA Breakthrough Therapy Designation',
      source: 'Reuters',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Johnson & Johnsons experimental cancer treatment received breakthrough therapy designation, potentially accelerating approval.',
      url: '#',
    },
    {
      id: '2',
      headline: 'J&J Talc Litigation: Company Proposes $8 Billion Settlement',
      source: 'Wall Street Journal',
      timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000),
      sentiment: 'negative',
      summary: 'Johnson & Johnson proposed a new settlement framework for talc-related lawsuits, seeking to resolve long-running litigation.',
      url: '#',
    },
  ],
  XOM: [
    {
      id: '1',
      headline: 'Exxon Permian Basin Production Hits New Record',
      source: 'Bloomberg',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Exxon Mobils Permian Basin operations produced a record 1.8 million barrels of oil equivalent per day.',
      url: '#',
    },
    {
      id: '2',
      headline: 'Exxon Advances Carbon Capture Project in Texas',
      source: 'Reuters',
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Exxon secured additional partners for its Houston carbon capture hub, the largest such project in North America.',
      url: '#',
    },
  ],
  PG: [
    {
      id: '1',
      headline: 'P&G Raises Full-Year Guidance on Strong Brand Performance',
      source: 'CNBC',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      sentiment: 'positive',
      summary: 'Procter & Gamble raised its annual sales and profit forecasts citing strong demand for premium beauty and health products.',
      url: '#',
    },
    {
      id: '2',
      headline: 'P&G Expands Direct-to-Consumer Strategy with New Digital Platform',
      source: 'Ad Age',
      timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000),
      sentiment: 'neutral',
      summary: 'The consumer goods giant launched a new unified e-commerce platform across its brand portfolio.',
      url: '#',
    },
  ],
}

// Fundamental data by symbol
export const fundamentalData: Record<string, FundamentalData> = {
  AAPL: {
    symbol: 'AAPL',
    revenue: 395_000_000_000,
    revenueGrowth: 8.2,
    netIncome: 97_000_000_000,
    netIncomeGrowth: 11.5,
    eps: 6.42,
    epsGrowth: 12.8,
    grossMargin: 45.2,
    operatingMargin: 30.5,
    netMargin: 24.6,
    roe: 147.5,
    roa: 28.3,
    debtToEquity: 1.52,
    currentRatio: 0.94,
    freeCashFlow: 102_000_000_000,
    bookValue: 4.25,
    priceToBook: 42.1,
    priceToSales: 7.8,
    beta: 1.28,
  },
  MSFT: {
    symbol: 'MSFT',
    revenue: 245_000_000_000,
    revenueGrowth: 15.8,
    netIncome: 88_000_000_000,
    netIncomeGrowth: 18.2,
    eps: 11.85,
    epsGrowth: 19.4,
    grossMargin: 69.8,
    operatingMargin: 44.2,
    netMargin: 35.9,
    roe: 38.5,
    roa: 19.2,
    debtToEquity: 0.35,
    currentRatio: 1.77,
    freeCashFlow: 74_000_000_000,
    bookValue: 31.45,
    priceToBook: 12.0,
    priceToSales: 11.5,
    beta: 0.92,
  },
  NVDA: {
    symbol: 'NVDA',
    revenue: 130_000_000_000,
    revenueGrowth: 122.5,
    netIncome: 65_000_000_000,
    netIncomeGrowth: 168.2,
    eps: 26.35,
    epsGrowth: 172.4,
    grossMargin: 75.2,
    operatingMargin: 58.5,
    netMargin: 50.0,
    roe: 115.8,
    roa: 55.2,
    debtToEquity: 0.41,
    currentRatio: 4.17,
    freeCashFlow: 45_000_000_000,
    bookValue: 22.80,
    priceToBook: 38.4,
    priceToSales: 16.8,
    beta: 1.65,
  },
  GOOGL: {
    symbol: 'GOOGL',
    revenue: 340_000_000_000,
    revenueGrowth: 12.5,
    netIncome: 85_000_000_000,
    netIncomeGrowth: 28.4,
    eps: 6.85,
    epsGrowth: 30.2,
    grossMargin: 56.8,
    operatingMargin: 28.5,
    netMargin: 25.0,
    roe: 28.4,
    roa: 16.5,
    debtToEquity: 0.08,
    currentRatio: 2.05,
    freeCashFlow: 72_000_000_000,
    bookValue: 24.15,
    priceToBook: 5.9,
    priceToSales: 5.2,
    beta: 1.05,
  },
  JPM: {
    symbol: 'JPM',
    revenue: 170_000_000_000,
    revenueGrowth: 9.8,
    netIncome: 52_000_000_000,
    netIncomeGrowth: 12.5,
    eps: 18.25,
    epsGrowth: 14.2,
    grossMargin: 0,
    operatingMargin: 38.5,
    netMargin: 30.6,
    roe: 15.8,
    roa: 1.2,
    debtToEquity: 1.15,
    currentRatio: 0,
    freeCashFlow: 35_000_000_000,
    bookValue: 115.50,
    priceToBook: 1.7,
    priceToSales: 3.3,
    beta: 1.12,
  },
  JNJ: {
    symbol: 'JNJ',
    revenue: 88_000_000_000,
    revenueGrowth: 4.2,
    netIncome: 15_000_000_000,
    netIncomeGrowth: -5.8,
    eps: 6.25,
    epsGrowth: -4.5,
    grossMargin: 68.5,
    operatingMargin: 22.8,
    netMargin: 17.0,
    roe: 18.5,
    roa: 8.2,
    debtToEquity: 0.45,
    currentRatio: 1.15,
    freeCashFlow: 18_000_000_000,
    bookValue: 33.80,
    priceToBook: 4.6,
    priceToSales: 4.3,
    beta: 0.55,
  },
  XOM: {
    symbol: 'XOM',
    revenue: 350_000_000_000,
    revenueGrowth: 5.5,
    netIncome: 38_000_000_000,
    netIncomeGrowth: -8.2,
    eps: 9.52,
    epsGrowth: -6.8,
    grossMargin: 32.5,
    operatingMargin: 15.8,
    netMargin: 10.9,
    roe: 16.2,
    roa: 8.5,
    debtToEquity: 0.22,
    currentRatio: 1.32,
    freeCashFlow: 42_000_000_000,
    bookValue: 58.75,
    priceToBook: 1.8,
    priceToSales: 1.2,
    beta: 0.95,
  },
  PG: {
    symbol: 'PG',
    revenue: 85_000_000_000,
    revenueGrowth: 3.8,
    netIncome: 15_500_000_000,
    netIncomeGrowth: 6.2,
    eps: 6.58,
    epsGrowth: 7.5,
    grossMargin: 51.2,
    operatingMargin: 23.5,
    netMargin: 18.2,
    roe: 32.5,
    roa: 11.8,
    debtToEquity: 0.72,
    currentRatio: 0.68,
    freeCashFlow: 17_000_000_000,
    bookValue: 20.25,
    priceToBook: 8.0,
    priceToSales: 4.5,
    beta: 0.42,
  },
}

// Price targets by symbol
export const priceTargets: Record<string, PriceTarget> = {
  AAPL: {
    symbol: 'AAPL',
    currentPrice: 178.85,
    averageTarget: 205,
    highTarget: 250,
    lowTarget: 155,
    numberOfAnalysts: 42,
    strongBuy: 12,
    buy: 18,
    hold: 10,
    sell: 2,
    strongSell: 0,
  },
  MSFT: {
    symbol: 'MSFT',
    currentPrice: 378.91,
    averageTarget: 435,
    highTarget: 500,
    lowTarget: 350,
    numberOfAnalysts: 48,
    strongBuy: 18,
    buy: 22,
    hold: 7,
    sell: 1,
    strongSell: 0,
  },
  NVDA: {
    symbol: 'NVDA',
    currentPrice: 875.38,
    averageTarget: 1025,
    highTarget: 1200,
    lowTarget: 700,
    numberOfAnalysts: 52,
    strongBuy: 28,
    buy: 18,
    hold: 5,
    sell: 1,
    strongSell: 0,
  },
  GOOGL: {
    symbol: 'GOOGL',
    currentPrice: 141.80,
    averageTarget: 168,
    highTarget: 200,
    lowTarget: 130,
    numberOfAnalysts: 45,
    strongBuy: 14,
    buy: 20,
    hold: 9,
    sell: 2,
    strongSell: 0,
  },
  JPM: {
    symbol: 'JPM',
    currentPrice: 195.42,
    averageTarget: 225,
    highTarget: 260,
    lowTarget: 180,
    numberOfAnalysts: 28,
    strongBuy: 10,
    buy: 12,
    hold: 5,
    sell: 1,
    strongSell: 0,
  },
  JNJ: {
    symbol: 'JNJ',
    currentPrice: 156.32,
    averageTarget: 172,
    highTarget: 195,
    lowTarget: 145,
    numberOfAnalysts: 24,
    strongBuy: 4,
    buy: 8,
    hold: 10,
    sell: 2,
    strongSell: 0,
  },
  XOM: {
    symbol: 'XOM',
    currentPrice: 104.27,
    averageTarget: 122,
    highTarget: 145,
    lowTarget: 95,
    numberOfAnalysts: 26,
    strongBuy: 8,
    buy: 12,
    hold: 5,
    sell: 1,
    strongSell: 0,
  },
  PG: {
    symbol: 'PG',
    currentPrice: 162.85,
    averageTarget: 175,
    highTarget: 195,
    lowTarget: 150,
    numberOfAnalysts: 22,
    strongBuy: 5,
    buy: 10,
    hold: 6,
    sell: 1,
    strongSell: 0,
  },
}
