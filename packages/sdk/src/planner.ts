import { ContextModule, extractContent } from '@infinity/types'

export class Planner extends ContextModule {
  async buildTasks() {
    const allTasks = this.context.tasks
    const { inspirationVault } = this.context.workspace

    this.log(`Plan from task templates: ${allTasks.map((i) => i.name).join(', ')}`)

    const system = `
You are a good task planner, designed to choose tasks based on user's ideas.
The user will provide their ideas, please select a task template suitable for users' ideas

Task templates to choose:
${allTasks.map((task) => `- ${task.name}\n${task.description}`).join('\n\n')}

Please response with the task name you selected in <task></task> tag.
Example:
<task>TaskName</task>
`

    const { text } = await this.context.model.generateText({
      system,
      messages: [{ role: 'user', content: inspirationVault.join('\n\n') }],
    })

    const task = extractContent(text, 'task')

    this.log(`Selected task: ${task}`)

    return allTasks.filter((i) => i.name === task)
  }
}
