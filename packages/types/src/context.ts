import { Trigger } from './trigger'
import { Agent } from './agent'
import { CoreTool } from 'ai'
import { Settings } from './settings'
import { Perception } from './perception'
import { Inspiration } from './inspiration'
import { Tool } from './tool'
import { Task } from './task'
import { Action } from './action'

export class Context {
  public readonly agent: Agent
  public readonly trigger: Trigger
  public readonly workspace: Workspace = { inspirationVault: [] }
  public readonly artifacts: Artifact[] = []
  public readonly tools: Tool[] = []
  public readonly perceptions: Perception[] = []
  public readonly inspirations: Inspiration[] = []
  public readonly tasks: Task[] = []
  public readonly actions: Action[] = []

  constructor({ agent, trigger }: { agent: Agent; trigger: Trigger }) {
    this.agent = agent
    this.trigger = trigger
  }

  initialize() {
    this.tools.push(...this.agent.tools.map((tool) => new tool(this)))
    this.perceptions.push(...this.agent.perceptions.map((perception) => new perception(this)))
    this.inspirations.push(...this.agent.inspirations.map((inspiration) => new inspiration(this)))
    this.tasks.push(...this.agent.tasks.map((task) => new task(this)))
    this.actions.push(...this.agent.actions.map((action) => new action(this)))
    this.model.initialize(this)
  }

  getSettings<T extends Settings>(type: new (...args: any[]) => T): T {
    return this.agent.settings.find((i) => i instanceof type) as T
  }

  getPerception<T extends Perception>(type: new (...args: any[]) => T): T {
    return this.perceptions.find((i) => i instanceof type) as T
  }

  getTools() {
    return this.tools.reduce(
      (acc, tool) => {
        acc[tool.name] = tool.getTool()
        return acc
      },
      {} as Record<string, CoreTool>,
    )
  }

  get model() {
    return this.agent.model
  }
}

export type Idea = string
export type Workspace = {
  inspirationVault: Idea[]
}

export type Artifact = {
  text?: string
  image?: Buffer
  music?: Buffer
}
