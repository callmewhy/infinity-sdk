import { z } from 'zod'
import { Tool } from '@infinity/types'
import { CoreTool, tool } from 'ai'
import axios from 'axios'

export class TokenAddressTool extends Tool {
  getTool(): CoreTool {
    return tool({
      description:
        'Retrieves comprehensive information about a specific cryptocurrency or token using its contract address. This tool returns detailed token metrics including current price, trading volume, liquidity, market capitalization, social media links, FDV(Fully Diluted Valuation), the number of transactions in the past period of time(m5: 5min, h1: 1hour, h24: 24hour). Use this tool when you need up-to-date market data and fundamental metrics for any token that exists on blockchain networks. The tool will return an empty response if the contract address is invalid or the token is not found in the database. Note: Price data may have a slight delay of up to 5 minutes depending on market conditions.',
      parameters: z.object({
        tokenAddress: z
          .string()
          .describe(
            'The contract address of the token. e.g. 32 to 44 characters for Solana, 0x... for EVM-compatible chains',
          ),
      }),
      execute: async ({ tokenAddress }: { tokenAddress: string }, { toolCallId }) => {
        try {
          return await fetchDexscreenerToken(tokenAddress)
        } catch (error: any) {
          return {}
        }
      },
    })
  }
}

export async function fetchDexscreenerToken(contractAddress: string) {
  const url = `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`

  const { data } = await axios.get(url)
  if (!data?.pairs || data.pairs.length === 0) {
    throw new Error(`No pairs found for token ${contractAddress}`)
  }

  const pair = data.pairs[0]

  let name = null
  let symbol = null

  for (const pair of data.pairs) {
    if (pair.baseToken.address === contractAddress) {
      name = pair.baseToken.name
      symbol = pair.baseToken.symbol
      break
    } else {
      if (pair.quoteToken.address === contractAddress) {
        name = pair.quoteToken.name
        symbol = pair.quoteToken.symbol
        break
      }
    }
  }

  return {
    name: name,
    symbol: symbol,
    twitter: pair.info?.socials?.find((s: any) => s.type === 'twitter')?.url,
    telegram: pair.info?.socials?.find((s: any) => s.type === 'telegram')?.url,
    website: pair.info?.websites?.find((s: any) => s.label === 'Website')?.url,
    image: pair.info?.imageUrl,
    marketcap: pair.marketCap,
    price: pair.priceUsd,
    rawData: data,
  }
}
