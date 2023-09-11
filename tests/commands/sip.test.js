const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')
const services = require('../../src/services')

const callSip = args =>
  program.parseAsync(['node', 'index.js', 'SIP', ...args])

const sampleArgs = [1000, 1000, 1000]

describe('commands/sip', () => {
  describe('input validation', () => {
    let loggerStub
    let processExitStub
  
    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'error')
      processExitStub = sinon.stub(process, 'exit')

    })
  
    afterEach(() => {
      loggerStub.restore()
      processExitStub.restore()
    })

    it('should throw an error if no arguments are passed',  () => {
      callSip([]) // no arguments
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if the arguments are not numbers',  () => {
      callSip(['a', 'b', 'c'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if the arguments are not positive',  () => {
      callSip(['-1', '-2', '-3'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })
  })

  describe('interaction', () => {
    let loggerStub
    let sipServiceStub

    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info')
      sipServiceStub = sinon
        .stub(services, 'sip')
        .resolves()
    })

    afterEach(() => {
      loggerStub.restore()
      sipServiceStub.restore()
    })

    it('should log sip as info',  () => {
      callSip(sampleArgs)
      expect(loggerStub.calledWith(sinon.match(/SIP/))).to.be.true
    })

    it('should call services.sip with correct params',  () => {
      callSip(sampleArgs)

      expect(sipServiceStub.calledWith([
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
      ])).to.be.true
    })

    it('should floor the sip down if it has decimal places',  () => {
      callSip(sampleArgs.map(sip => sip + 0.7))

      expect(sipServiceStub.calledWith([
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
      ])).to.be.true
    })
  })
})
