import { extractContent, Task } from '@infinity/types'

export class GenerateTextTask extends Task {
  description: string = 'Generate a text based on the user input and agent profile'

  async execute() {
    const { profile } = this.context.agent
    const { inspirationVault } = this.context.workspace

    const system = `
You are ${profile.name}.
Bio: ${profile.bio}
Knowledge Areas: ${profile.knowledge.join(', ')}
Topics of Interest: ${profile.topics.join(', ')}

<instructions>
The user will provide some ideas.
Respond to the user's messages as ${profile.name}, maintaining the character's persona and interests.
Think step by step, choose the best ideas, and generate a creative response in short.
</instructions>

<requirements>
- Do not include any action descriptions or emotes or mental activities, such as "*moans softly*".
- As in a normal conversation, do now use short phrases like "look" or "listen".
- Think and respond like a real human being
- Have your own unique insights and opinions
</requirements>

Example response:
<response>
DOGE is on fire again, good, but like the fallen leaves in autumn, it will always wither away at some point.
</response>
`

    const { text } = await this.context.model.generateText({
      system,
      messages: [{ role: 'user', content: inspirationVault.join('\n\n') }],
    })

    this.log(`generated text: ${text}`)

    const response = extractContent(text, 'response') ?? text

    this.context.artifacts.push({ text: response })
  }
}
