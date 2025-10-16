import { extractContent, Task } from '@infinity/types'

export class GenerateMusicTask extends Task {
  description: string = 'Generate music based on the user input and agent profile'

  async execute() {
    const { profile } = this.context.agent
    const { inspirationVault } = this.context.workspace

    const system = `
You are an AIGC prompt generator.
Please design a music piece based on the trending ideas and profile provided by the user, and return the AI-generated music prompt.

<profile>
Name: ${profile.name}
Bio: ${profile.bio}
Knowledge Areas: ${profile.knowledge.join(', ')}
Topics of Interest: ${profile.topics.join(', ')}
Musical Style:
${profile.style.join('\n')}
</profile>

<prompt_guide>
A concise guide for writing effective AI music prompts:
Essential Components:

Base Structure:
- Genre: "Classical", "Electronic", "Jazz", "Ambient"...
- Mood/emotion
- Tempo and rhythm
- Instrumentation

Technical Details:
- Key signature
- BPM (beats per minute)
- Duration
- Production style

Musical Elements:
- Melody characteristics
- Harmony type
- Dynamic range
- Sound texture

Best Practices:
- Define primary genre clearly
- Specify emotional intent
- List main instruments
- Include tempo and rhythm details
- Describe desired atmosphere
- Be specific about production style

Example Format:
[Genre], [mood], [tempo], [key instruments], [musical characteristics], [production elements]

Sample Prompt:
Ambient electronic music, peaceful and dreamy, 80 BPM, featuring synthesizer pads, piano arpeggios, with reverb-heavy production, subtle percussion, in C major
</prompt_guide>

<instruction>
Think step by step in <thinking></thinking> tag.
The user will provide some ideas, pick the most interesting one, combine your own ideas to design a music piece and return its prompt.
Put your generated prompt in <prompt></prompt> tags.
</instruction>

Example:
<thinking>
The user wants a peaceful ambient track with electronic elements.
</thinking>
<prompt>
Ambient electronic music, peaceful and dreamy, 80 BPM, featuring synthesizer pads, piano arpeggios, with reverb-heavy production, subtle percussion, in C major
</prompt>
`

    const { text } = await this.context.model.generateText({
      system,
      messages: [{ role: 'user', content: inspirationVault.join('\n\n') }],
    })

    const prompt = extractContent(text, 'prompt') ?? text

    this.log(`generate music with prompt: ${prompt}`)

    const { music } = await this.context.model.generateMusic({ prompt })

    this.context.artifacts.push({ music })
  }
}
