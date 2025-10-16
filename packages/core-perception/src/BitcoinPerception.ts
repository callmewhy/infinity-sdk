import { Perception } from '@infinity/types'
import { BitcoinSettings } from '@infinity/core-settings'
import { keys } from '@cmdcode/crypto-utils'
import { Address, ScriptData, Signer, Tap, Tx } from '@cmdcode/tapscript'
import axios from 'axios'

type Utxo = {
  txid: string
  vout: number
  satoshi: number
}

type Input = {
  txid: string
  vout: number
  sequence: number
  utxo: number
}

type Output = {
  utxo: number
  script: ScriptData
  address?: string
}

const feeRate = 5
const INSCRIBE_TYPE = 'image/png'
const INSCRIBE_SATOSHI = 330

export class BitcoinPerception extends Perception {
  get privateKey() {
    return this.context.getSettings(BitcoinSettings).privateKey
  }

  get changeAddress() {
    return this.context.getSettings(BitcoinSettings).changeAddress
  }

  get toAddress() {
    return this.context.getSettings(BitcoinSettings).toAddress
  }

  async buildCommitTx(image: Buffer): Promise<string | undefined> {
    try {
      const secret = keys.gen_seckey()
      const commitAddress = await this.generateInscribeAddress(secret, image)
      const btcUtxo = await this.fetchUtxo()

      if (!btcUtxo.length) {
        this.log('Insufficient balance')
      }

      const size = Math.floor((42 + 272 * 2 + 128 * 2) / 4 + 128)
      let networkFee = feeRate * size

      const commitAmount = INSCRIBE_SATOSHI

      const inputs: Input[] = []
      let allInput = 0

      btcUtxo.forEach((utxo) => {
        inputs.push({
          txid: utxo.txid,
          vout: utxo.vout,
          sequence: 0,
          utxo: utxo.satoshi,
        })
        allInput += utxo.satoshi
      })

      const outputs: Output[] = [
        {
          utxo: commitAmount + 154 * feeRate,
          script: Address.toScriptPubKey(commitAddress),
          address: commitAddress,
        },
        {
          utxo: allInput - commitAmount - networkFee,
          script: Address.toScriptPubKey(this.changeAddress),
          address: this.changeAddress,
        },
      ]

      const inputsReveal = btcUtxo.map((utxo) => ({
        txid: utxo.txid,
        vout: utxo.vout,
        sequence: 0,
        utxo: utxo.satoshi,
      }))

      const outputsReveal = [
        {
          utxo: INSCRIBE_SATOSHI,
          script: Address.toScriptPubKey(commitAddress),
        },
      ]

      const estimateTxSize = await this.estimateBtcTxSize(inputs, outputs, false, secret, image)
      const estimateTxRevealSize = await this.estimateBtcTxSize(inputsReveal, outputsReveal, true, secret, image)

      if (!estimateTxSize) {
        this.log(`Insufficient estimateTxSize: ${estimateTxSize}`)
      }

      networkFee = feeRate * estimateTxSize
      const revealNetworkFee = feeRate * estimateTxRevealSize

      const txdata = Tx.create({
        vin: inputs.map((input) => ({
          txid: input.txid,
          vout: input.vout,
          prevout: {
            value: input.utxo,
            scriptPubKey: Address.toScriptPubKey(this.changeAddress),
          },
        })),
        vout: [
          {
            value: commitAmount + revealNetworkFee,
            scriptPubKey: Address.toScriptPubKey(commitAddress),
          },
          {
            value: allInput - commitAmount - revealNetworkFee - networkFee,
            scriptPubKey: Address.toScriptPubKey(this.changeAddress),
          },
        ],
      })

      const [tseckey] = Tap.getSecKey(this.privateKey)
      for (let i = 0; i < inputs.length; i++) {
        const sig = Signer.taproot.sign(tseckey, txdata, i)
        txdata.vin[i].witness = [sig]
      }

      const psbtHex = Tx.encode(txdata).hex
      const { data: commitTxid } = await this.broadcastTx(psbtHex)
      this.log(`CommitTxid: ${commitTxid}`)

      return await this.buildRevealTx(secret, commitTxid, 0, commitAmount + revealNetworkFee, image)
    } catch (error) {
      this.log(`commit tx error ${error}`)
    }
  }

  async generateScript(pubkey: Uint8Array, image: Buffer): Promise<(string | Uint8Array | Buffer)[]> {
    const ec = new TextEncoder()
    const mimetype = ec.encode(INSCRIBE_TYPE)
    return [pubkey, 'OP_CHECKSIG', 'OP_0', 'OP_IF', ec.encode('ord'), '01', mimetype, 'OP_0', image, 'OP_ENDIF']
  }

  async generateInscribeAddress(seckey: Uint8Array, image: Buffer): Promise<string> {
    const pubkey = keys.get_pubkey(seckey, true)
    const script = await this.generateScript(pubkey, image)

    const tapleaf = Tap.encodeScript(script)

    const [tpubkey] = Tap.getPubKey(pubkey, { target: tapleaf })
    return Address.p2tr.fromPubKey(tpubkey, 'main')
  }

  async estimateBtcTxSize(
    inputs: Input[],
    outputs: Output[],
    isReveal: boolean,
    secret: Uint8Array,
    image: Buffer,
  ): Promise<number> {
    const pubkey = keys.get_pubkey(secret, true)
    const seckey = keys.get_seckey(secret)

    const script = await this.generateScript(pubkey, image)

    const tapleaf = Tap.encodeScript(script)
    const [tpubkey, cblock] = Tap.getPubKey(pubkey, { target: tapleaf })

    const vin = inputs.map((item) => {
      return {
        txid: item.txid,
        vout: item.vout,
        sequence: item.sequence,
        prevout: {
          value: item.utxo,
          scriptPubKey: isReveal ? ['OP_1', tpubkey] : seckey,
        },
      }
    })

    const vout = outputs.map((item) => {
      return {
        value: item.utxo,
        scriptPubKey: item.script,
      }
    })

    const txdata = Tx.create({
      vin,
      vout,
    })

    if (isReveal) {
      const sig = Signer.taproot.sign(seckey, txdata, 0, { extension: tapleaf })
      txdata.vin[0].witness = [sig, script, cblock]
    } else {
      const [tseckey] = Tap.getSecKey(seckey)
      const sig = Signer.taproot.sign(tseckey, txdata, 0, {})
      txdata.vin[0].witness = [sig]
    }

    return Tx.util.getTxSize(txdata).vsize
  }

  async broadcastTx(txHex: string): Promise<{ data: any }> {
    const url = `https://open-api-fractal-testnet.unisat.io/v1/indexer/local_pushtx`
    const response = await axios.post(url, { txHex })
    return response.data
  }

  async fetchUtxo(): Promise<Utxo[]> {
    const url = `https://open-api-fractal-testnet.unisat.io/v1/indexer/address/${this.changeAddress}/utxo-data`
    const response = await axios.get(url)
    return response.data.data.utxo
  }

  async buildRevealTx(
    secret: Uint8Array,
    txid: string,
    vout: number,
    sendAmount: number,
    image: Buffer,
  ): Promise<string> {
    const seckey = keys.get_seckey(secret)
    const pubkey = keys.get_pubkey(secret, true)

    const script = await this.generateScript(pubkey, image)
    const tapleaf = Tap.encodeScript(script)
    const [tpubkey, cblock] = Tap.getPubKey(pubkey, { target: tapleaf })
    const txdata = Tx.create({
      vin: [
        {
          txid,
          vout,
          prevout: {
            value: sendAmount,
            scriptPubKey: ['OP_1', tpubkey],
          },
        },
      ],
      vout: [
        {
          value: INSCRIBE_SATOSHI,
          scriptPubKey: Address.toScriptPubKey(this.toAddress),
        },
      ],
    })

    const sig = Signer.taproot.sign(seckey, txdata, 0, { extension: tapleaf })
    txdata.vin[0].witness = [sig, script, cblock]
    const isValid = Signer.taproot.verify(txdata, 0, { pubkey, throws: true })

    if (isValid) {
      const { data: revealTxid } = await this.broadcastTx(Tx.encode(txdata).hex)
      return revealTxid
    } else {
      throw new Error('Reveal transaction verification failed')
    }
  }
}
