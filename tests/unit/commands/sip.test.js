const sinon = require('sinon')
const { expect } = require('chai')
const logger = require('../../../src/helpers/logger')
const program = require('../../../src/commands')
const { sipService } = require('../../../src/services')

const callSip = args =>
  program.parseAsync(['node', 'index.js', 'SIP', ...args])

const sampleArgs = [1000, 1000, 1000]

describe('commands/sip', () => {
  describe('success', () => {
    let sipServiceStub

    beforeEach(() => {
      sipServiceStub = sinon
        .stub(sipService, 'execute')
        .resolves()
    })

    afterEach(() => {
      sipServiceStub.restore()
    })

    it('should call services.execute with correct params',  () => {
      callSip(sampleArgs)

      expect(sipServiceStub.args[0][0]).to.deep.equal([
        {
          name: 'equity',
          sip: sampleArgs[0]
        },
        {
          name: 'debt',
          sip: sampleArgs[1]
        },
        {
          name: 'gold',
          sip: sampleArgs[2]
        }
      ])
    })

    it('should floor the sip down if it has decimal places',  () => {
      callSip(sampleArgs.map(sip => sip + 0.7))

      expect(sipServiceStub.args[0][0]).to.deep.equal([
        {
          name: 'equity',
          sip: sampleArgs[0]
        },
        {
          name: 'debt',
          sip: sampleArgs[1]
        },
        {
          name: 'gold',
          sip: sampleArgs[2]
        }
      ])
    })
  })

  describe('failure', () => {
    let sipServiceStub
    beforeEach(() => {
      sipServiceStub = sinon
        .stub(sipService, 'execute')
        .rejects(new Error('error'))
    })

    afterEach(() => {
      sipServiceStub.restore()
    })

    it('should log error if it catches an error', async () => {
      await callSip(sampleArgs)

      expect(logger.error.args[0][0]).to.include('error')
    })
  })
})
