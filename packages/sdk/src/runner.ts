import {
  Action,
  Agent,
  Context,
  Inspiration,
  Model,
  Perception,
  Profile,
  Settings,
  Task,
  Tool,
  Trigger,
  TriggerType,
} from '@infinity/types'
import { Coordinator } from './coordinator'

export class AgentRunner {
  private isRunning = true
  private readonly agent: Agent
  private readonly triggers: Trigger[]

  constructor({
    settings,
    profile,
    triggers,
    model,
    tools,
    perceptions,
    inspirations,
    actions,
    tasks,
  }: {
    profile: Profile
    settings: Settings[]
    triggers: Trigger[]
    model: Model
    tools: (new (context: Context) => Tool)[]
    perceptions: (new (context: Context) => Perception)[]
    inspirations: (new (context: Context) => Inspiration)[]
    actions: (new (context: Context) => Action)[]
    tasks: (new (context: Context) => Task)[]
  }) {
    this.triggers = triggers
    this.agent = {
      settings,
      profile,
      model,
      tools,
      perceptions,
      inspirations,
      actions,
      tasks,
    }
  }

  public start() {
    for (const trigger of this.triggers) {
      switch (trigger.type) {
        case TriggerType.Schedule: {
          this.startScheduling(trigger, trigger.intervalSeconds).catch(console.error)
          break
        }
      }
    }
  }

  public stop() {
    this.isRunning = false
  }

  public async startScheduling(trigger: Trigger, intervalSeconds: number) {
    while (this.isRunning) {
      try {
        await this.run(trigger)
      } catch (error) {
        console.error(error)
      }
      await new Promise((resolve) => setTimeout(resolve, intervalSeconds * 1000))
    }
  }

  private async run(trigger: Trigger) {
    const context = new Context({ agent: this.agent, trigger })
    const coordinator = new Coordinator(context)
    await coordinator.start()
  }
}
