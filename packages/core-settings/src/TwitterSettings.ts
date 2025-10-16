import { Settings } from '@infinity/types'

export class TwitterSettings extends Settings {
  readonly bearerToken: string
  readonly clientId: string
  readonly clientSecret: string
  accessToken: string
  refreshToken: string

  constructor({
    bearerToken,
    clientId,
    clientSecret,
    accessToken,
    refreshToken,
  }: {
    bearerToken: string
    clientId: string
    clientSecret: string
    accessToken: string
    refreshToken: string
  }) {
    super()
    this.bearerToken = bearerToken
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }
}
