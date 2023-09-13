const sinon = require('sinon')
const { expect } = require('chai')
const logger = require('../../src/helpers/logger')
const program = require('../../src/commands')
const { sipService } = require('../../src/services')

const callSip = args =>
  program.parseAsync(['node', 'index.js', 'SIP', ...args])

const sampleArgs = [1000, 1000, 1000]

describe('commands/sip', () => {
  describe('success', () => {
    let loggerStub
    let sipServiceStub

    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info')
      sipServiceStub = sinon
        .stub(sipService, 'execute')
        .resolves()
    })

    afterEach(() => {
      loggerStub.restore()
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
    it('should log error if it catches an error', async () => {
      const loggerStub = sinon.stub(logger, 'error')
      const sipServiceStub = sinon
        .stub(sipService, 'execute')
        .rejects(new Error('error'))

      await callSip(sampleArgs)

      expect(loggerStub.args[0][0]).to.include('error')

      loggerStub.restore()
      sipServiceStub.restore()
    })
  })
})
