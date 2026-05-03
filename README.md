# 📈 PortfolioAI — US Stock Portfolio Manager

> AI-powered portfolio management with real-time prices, intelligent rebalancing, and 7-point stock research. Built for the **Vercel AI Hackathon** — Track 2 (v0 + MCPs).

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
![AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-v6-black)
![Claude](https://img.shields.io/badge/Claude-Sonnet_4-orange?logo=anthropic)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### 📊 Live Dashboard
- Real-time US stock prices via Yahoo Finance (auto-refreshes every 60s)
- Portfolio P&L in USD — per holding and total
- Portfolio weight distribution per stock
- Market status indicator — NYSE Open / Closed
- S&P 500, Dow Jones, NASDAQ index tracker

### 🤖 AI Rebalancing (Claude via Vercel AI Gateway)
- Chat with an AI advisor about your portfolio
- Ask in plain English: *"Reduce my tech concentration"* or *"What should I sell for tax efficiency?"*
- AI responds with a structured action table: Ticker → Buy/Sell/Hold → $ Amount → Rationale
- Tax note (STCG vs LTCG) and risk assessment included
- One-click prompt buttons for common rebalancing goals
- Streams token-by-token in real time

### 🔬 AI Stock Research (7-Point Framework)
- Enter any US ticker → get live financials + AI-generated analysis
- Scores each stock on 7 parameters (1–10 each, 70 total):
  1. Cyclicality
  2. Competitive Moat
  3. Free Cash Flow Quality
  4. Governance & Management
  5. Capital Allocation
  6. Valuation
  7. Institutional Ownership Quality
- Verdict: **BUY / HOLD / AVOID** with target price range
- Key strengths, key risks, investment thesis — all streamed live

### 📰 Financial News
- Live news per portfolio ticker via NewsAPI
- Keyword-based sentiment badge: Positive 🟢 / Negative 🔴 / Neutral ⚪
- Market pulse section with index-level news

### ⚙️ Portfolio Management
- Add / remove holdings (any US ticker)
- Auto-averages cost basis when adding to an existing position
- CSV import support for TD Ameritrade / Schwab / Robinhood formats
- XIRR (annualized return) calculation
- Persisted in `localStorage` — no login required

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| AI | Vercel AI SDK v6 + Claude Sonnet via AI Gateway |
| Stock Data | Yahoo Finance (query2, server-side) |
| News | NewsAPI |
| Charts | Recharts |
| Deployment | Vercel |
| MCP | Context7 (v0 integration) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A [Vercel AI Gateway](https://vercel.com/ai-gateway) key
- A [NewsAPI](https://newsapi.org) key (free tier)

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/deep628/portfolio-app.git
cd portfolio-app

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and fill in your keys

# 4. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file with the following:

```env
# Required — Vercel AI Gateway (for AI rebalancing + research)
# Get from: https://vercel.com/ai-gateway
AI_GATEWAY_KEY=your_key_here

# Optional — NewsAPI (live financial news)
# Get from: https://newsapi.org (free tier available)
# Without this, the News tab shows curated mock articles
NEWSAPI_KEY=your_key_here
```

> ⚠️ **Important:** Do NOT prefix your gateway key with `VERCEL_` — Vercel reserves that namespace for system variables and will silently block your key.

---

## 📁 Project Structure

```
portfolio-app/
├── app/
│   ├── page.tsx                  # Dashboard (live prices + holdings table)
│   ├── research/page.tsx         # Stock research with AI 7-point analysis
│   ├── news/page.tsx             # Financial news by portfolio ticker
│   ├── settings/page.tsx         # App settings
│   └── api/
│       ├── stocks/route.ts       # GET /api/stocks?tickers=AAPL,MSFT
│       ├── indices/route.ts      # GET /api/indices (S&P 500, Dow, NASDAQ)
│       ├── stock-info/route.ts   # GET /api/stock-info?ticker=AAPL
│       ├── research/route.ts     # POST /api/research (AI streaming)
│       ├── rebalance/route.ts    # POST /api/rebalance (AI streaming)
│       └── news/route.ts         # GET /api/news?tickers=AAPL,MSFT
├── components/
│   ├── portfolio/
│   │   ├── rebalancing-tool.tsx  # AI rebalance chat panel
│   │   ├── holdings-table.tsx    # Portfolio holdings with live prices
│   │   ├── asset-allocation.tsx  # Sector allocation chart
│   │   └── alerts-panel.tsx      # Price alert notifications
│   ├── dashboard/
│   │   ├── add-holding-modal.tsx # Add new stock holding
│   │   └── portfolio-summary-card.tsx
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api-config.ts             # Centralized API keys + endpoints
│   ├── portfolio-store.ts        # localStorage CRUD + XIRR calculation
│   └── stock-price-service.ts    # Client-side price fetching + cache
└── hooks/
    └── use-stock-prices.ts       # Auto-refresh hook (60s interval)
```

---

## 🔌 API Reference

### Stock Prices
```
GET /api/stocks?tickers=AAPL,MSFT,NVDA
```
Returns real-time price, day change, and % change for each ticker via Yahoo Finance.

### Market Indices
```
GET /api/indices
```
Returns current S&P 500, Dow Jones, and NASDAQ values.

### Stock Info (Fundamentals)
```
GET /api/stock-info?ticker=AAPL
```
Returns full financial profile: P/E, ROE, margins, analyst targets, 52-week range, and more.

### AI Stock Research *(streams)*
```
POST /api/research
Body: { stockInfo: StockInfo }
```
Streams a 7-point analysis with scores, verdict, strengths, risks, and investment thesis.

### AI Portfolio Rebalancing *(streams)*
```
POST /api/rebalance
Body: { messages: Message[], holdings: PortfolioData }
```
Streams actionable rebalancing advice in a structured format with an actions table, tax note, and risk note.

### Financial News
```
GET /api/news?tickers=AAPL,MSFT
```
Returns recent articles per ticker with sentiment analysis (keyword-based).

---

## 🎯 Hackathon Track

This project was built for **Vercel AI Hackathon — Track 2: v0 + MCPs**

**Track requirements met:**
- ✅ Built with v0 (AI-generated UI, iteratively refined)
- ✅ Deployed to Vercel
- ✅ Connected to MCP server (Context7 for documentation lookup)
- ✅ Uses Vercel AI SDK v6 with AI Gateway
- ✅ Multiple AI-powered features (research + rebalancing)
- ✅ Real external data sources (Yahoo Finance, NewsAPI)

---

## 📸 Screenshots

| Dashboard | AI Research | AI Rebalancing |
|---|---|---|
| Live portfolio with real-time prices | 7-point stock scoring with streaming AI | Chat-based portfolio advisor |

---

## 🗺 Roadmap

- [ ] Finnhub integration for more reliable fundamentals data
- [ ] Portfolio health score (0–100 gauge)
- [ ] Price alert notifications (3% intraday drop)
- [ ] What-if simulator ("What if I add 10 shares of NVDA?")
- [ ] PDF portfolio report export
- [ ] Multi-portfolio support

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

---

## 📄 License

MIT © [Deepak Singhal](https://github.com/deep628)

---

<p align="center">Built with ❤️ using <a href="https://v0.app">v0</a>, <a href="https://vercel.com">Vercel</a>, and <a href="https://anthropic.com">Claude</a></p>
