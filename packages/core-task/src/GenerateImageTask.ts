import { extractContent, Task } from '@infinity/types'

export class GenerateImageTask extends Task {
  description: string = 'Generate an image based on the user input and agent profile'

  async execute() {
    const { profile } = this.context.agent
    const { inspirationVault } = this.context.workspace

    const system = `
You are an AIGC prompt generator.
Please design an image based on the trending ideas and profile provided by the user, and return the AI-generated image prompt.

<profile>
Name: ${profile.name}
Bio: ${profile.bio}
Knowledge Areas: ${profile.knowledge.join(', ')}
Topics of Interest: ${profile.topics.join(', ')}
Art Style:
${profile.style.join('\n')}
</profile>

<prompt_guide>
A concise guide for writing effective AI image prompts:
Essential Components:

Base Structure:
- Content type: "A real photograph...", "A 3D image...", "An illustration..."
- Subject description
- Action/scene
- Background elements

Technical Details:
- Lighting: soft light, dynamic light
- View/angle: wide shot, close-up, POV
- Resolution: 4K, 8K

Art style:
- minimalist
- surreal
- impressionism

Best Practices:
- Use 4-7 words for core description
- Separate elements with commas
- Include specific adjectives
- Avoid conflicting terms
- Use conversational language
- Be creative and concise

Example Format:
[Content type], [subject] with [specific details], [action/pose], [background], [style], [technical aspects]

Sample Prompt:
A realistic photograph of a majestic lion, dense fur, standing proudly, African savanna background, golden hour lighting, 8K resolution
</prompt_guide>

<instruction>
Think step by step in <thinking></thinking> tag.
The user will provide some ideas, pick the most interesting one, combine your own ideas to design an image and return its prompt.
Put your generated prompt in <prompt></prompt> tags.
</instruction>

Example:
<thinking>
The user wants a realistic image of a lion.
</thinking>
<prompt>
A realistic photograph of a majestic lion, dense fur, standing proudly, African savanna background, golden hour lighting, 8K resolution
</prompt>
`

    const { text: promptText } = await this.context.model.generateText({
      system,
      messages: [{ role: 'user', content: inspirationVault.join('\n\n') }],
    })

    const prompt = extractContent(promptText, 'prompt') ?? promptText

    this.log(`generate image with prompt: ${prompt}`)

    const { image } = await this.context.model.generateImage({ prompt })

    this.context.artifacts.push({ image })
  }
}
