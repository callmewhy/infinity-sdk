export enum TriggerType {
  Schedule = 'Schedule',
  Polling = 'Polling',
}

export type Trigger =
  | {
      type: TriggerType.Schedule
      intervalSeconds: number
    }
  | {
      type: TriggerType.Polling
      endpoint: string
    }
