import { Action, Artifact } from '@infinity/types'
import { BitcoinPerception } from '@infinity/core-perception'

export class InscribeAction extends Action {
  async execute(artifact: Artifact): Promise<void> {
    if (artifact.image) {
      const bitcoinPerception = this.context.getPerception(BitcoinPerception)
      await bitcoinPerception.buildCommitTx(artifact.image)
    }
  }
}
