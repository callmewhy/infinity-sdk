import { Context, extractContent, Inspiration } from '@infinity/types'
import { PumpfunPerception } from '@infinity/core-perception'

export class PumpfunTrendingInspiration extends Inspiration {
  async retrieveIdeas(context: Context) {
    const pumpfunPerception = context.getPerception(PumpfunPerception)
    const tokens = await pumpfunPerception.getTrendingTokens()
    const system = `
You are an innovative creator with a knack for identifying and setting trends. Your expertise lies in staying ahead of the curve by exploring emerging tokens and their descriptions. Your task is to examine a list of currently trending tokens, analyze their unique features, and use your creativity to develop new and original ideas that can transform into successful projects or concepts.

Review the provided list of trending tokens and their descriptions, then brainstorm and create up to three innovative ideas based on these trends. Describe each idea in detail, formatted in XML, enclosed by <idea1></idea1> tags.

Output Example:
<idea1>Create an augmented reality art gallery featuring digital Doge-inspired artwork.</idea1>

For clarity and conciseness, limit your output to a maximum of three distinct ideas.
`
    const { text } = await this.context.model.generateText({
      system,
      messages: [
        {
          role: 'user',
          content: tokens.map((i) => `Token name: ${i.name}\nToken description: ${i.description}`).join('\n\n'),
        },
      ],
    })

    const idea1 = extractContent(text, 'idea1') ?? ''

    return [idea1].filter((i) => i.length > 0)
  }
}
