import { Context, extractContent, Inspiration } from '@infinity/types'
import { TwitterPerception } from '@infinity/core-perception'

export class TwitterTrendingInspiration extends Inspiration {
  async retrieveIdeas(context: Context) {
    const twitterPerception = context.getPerception(TwitterPerception)
    const news = await twitterPerception.getTrendingNews(context)
    const system = `
You are an innovative creator with a unique talent for identifying and setting trends. Staying ahead of the curve is your forte, and you do so by constantly exploring the latest trends on Twitter. Your task is to read through a list of currently trending topics, analyze their distinctive features, and leverage your creativity to develop new and original ideas that could transform into successful projects or concepts.

Please review the provided list of trending topics along with their associated tweet volumes, then brainstorm and create up to three innovative ideas based on the current trends. Describe each idea in detail, ensuring they are formatted in XML, enclosed by <idea></idea> tags.

Output Example:
<idea1>Develop a community event around #HashtagTrend1 by organizing virtual meet-ups and online discussions</idea1>
<idea2>Create an art series inspired by Trend2, showcasing its impact through visual storytelling</idea2>
<idea3>Write an article analyzing the social implications of Trend3, including expert interviews</idea3>

For optimal clarity and conciseness, remember to limit your output to a maximum of three distinct ideas.
`
    const { text } = await context.model.generateText({
      system,
      messages: [
        {
          role: 'user',
          content: news
            .map(({ locations, trends }) => {
              const locationRows = locations.map((i) => i.name)
              const trendRows = trends.map(({ name, tweet_volume }) => `Trend: ${name}\n, volume: ${tweet_volume}`)
              return `Locations: ${locationRows.join(',')}\nTrends: ${trendRows.join('\n')}`
            })
            .join('\n\n'),
        },
      ],
    })

    const idea1 = extractContent(text, 'idea1') ?? ''
    const idea2 = extractContent(text, 'idea2') ?? ''
    const idea3 = extractContent(text, 'idea3') ?? ''

    return [idea1, idea2, idea3].filter((i) => i.length > 0)
  }
}
