import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'
import { getAIGatewayKey, AI_CONFIG } from '@/lib/api-config'

export const maxDuration = AI_CONFIG.MAX_DURATION

const SYSTEM_PROMPT = `You are an expert US equity portfolio advisor. Analyze the user's current portfolio holdings, weights, and their rebalancing goal. Provide specific actionable rebalancing recommendations in USD amounts. Consider tax implications (short-term vs long-term capital gains). Be concise and structured.

IMPORTANT: Always format your response in the following structure:

## Summary
[Brief 2-3 sentence overview of the current portfolio status and recommended changes]

## Actions Table

| Ticker | Action | Amount ($) | Rationale |
|--------|--------|------------|-----------|
[Include specific BUY/SELL/HOLD actions with exact amounts in USD]

## Tax Note
[Brief note on tax implications - mention short-term capital gains (taxed as ordinary income) for holdings < 1 year and long-term capital gains (0%/15%/20% depending on income) for holdings > 1 year]

## Risk Note
[Brief risk assessment and any cautions the investor should be aware of]

Use US Dollar ($) symbol for all monetary values. Be specific with numbers.`

export async function POST(req: Request) {
  const aiGatewayKey = getAIGatewayKey()

  if (!aiGatewayKey) {
    return NextResponse.json(
      { error: 'AI Gateway key not configured. Add AI_GATEWAY_KEY to your Vercel environment variables.' },
      { status: 500 }
    )
  }

  const { messages, holdings } = await req.json()

  const holdingsContext = `
Current Portfolio Holdings:
${JSON.stringify(holdings, null, 2)}

Use this portfolio data to provide specific, actionable advice. All monetary values should be in US Dollars ($).
`
  const gateway = createOpenAI({
    apiKey: aiGatewayKey,
    baseURL: 'https://ai-gateway.vercel.sh/v1',
  })

  const userMessage = Array.isArray(messages) && messages.length > 0
    ? messages[messages.length - 1].content
    : 'Analyze my portfolio and suggest rebalancing actions.'

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4-20250514'),
    system: SYSTEM_PROMPT + '\n\n' + holdingsContext,
    messages: [{ role: 'user', content: userMessage }],
    abortSignal: req.signal,
  })

  // Plain text stream — matches what the client reads
  return new Response(result.textStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
