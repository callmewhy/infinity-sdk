import { ContextModule } from '@infinity/types'
import { Planner } from './planner'

export class Coordinator extends ContextModule {
  public async start() {
    this.log('Coordinator start')
    // initialize context
    this.context.initialize()

    // retrieve ideas from inspirations and store in inspiration vault
    const { workspace } = this.context
    for (const inspiration of this.context.inspirations) {
      this.log(`Inspiration retrieveIdeas: ${inspiration.name}`)
      const ideas = await inspiration.retrieveIdeas(this.context)
      workspace.inspirationVault.push(...ideas)
    }
    this.log(`Inspiration vault: ${JSON.stringify(workspace.inspirationVault, null, 2)}`)
    if (workspace.inspirationVault.length === 0) {
      this.log('No inspirations found, skipping planning and execution')
      return
    }

    // plan tasks
    this.log('Building tasks...')
    const planner = new Planner(this.context)
    const tasks = await planner.buildTasks()
    this.log(`Tasks: ${tasks.map((task) => task.name).join(', ')}`)

    // execute tasks
    for (const task of tasks) {
      this.log(`Executing task: ${task.constructor.name}`)
      await task.execute()
    }

    // execute actions
    for (const action of this.context.actions) {
      this.log(`Executing action: ${action.name}`)
      for (const artifact of this.context.artifacts) {
        await action.execute(artifact)
      }
    }
  }
}
