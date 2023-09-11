const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')
const { accountService } = require('../../src/services')
const db = require('../../src/dal/models')

const callSip = async args =>
  program.parseAsync(['node', 'index.js', 'sip', ...args])

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

    it('should throw an error if no arguments are passed', async () => {
      await callSip([]) // no arguments
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if the arguments are not numbers', () => {
      callSip(['a', 'b', 'c'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if the arguments are not positive', () => {
      callSip(['-1', '-2', '-3'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })
  })

  describe('interaction', () => {
    let loggerStub
    let accountServiceStub

    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info')
      accountServiceStub = sinon
        .stub(accountService, 'setSip')
        .resolves()
    })

    afterEach(() => {
      loggerStub.restore()
      accountServiceStub.restore()
    })

    it('should log sip as info', async () => {
      await callSip([1000, 1000, 1000])
      expect(loggerStub.calledWith(sinon.match(/sip/))).to.be.true
    })

    it('should call accountService.setSip with correct params', async () => {
      await callSip([1000, 1000, 1000])

      expect(accountServiceStub.calledWith([
        {
          name: 'equity',
          sip: 1000
        },
        {
          name: 'debt',
          sip: 1000
        },
        {
          name: 'gold',
          sip: 1000
        }
      ])).to.be.true
    })

    it('should floor the sip down if it has decimal places', async () => {
      await callSip([1000.5, 1000.5, 1000.5])

      expect(accountServiceStub.calledWith([
        {
          name: 'equity',
          sip: 1000
        },
        {
          name: 'debt',
          sip: 1000
        },
        {
          name: 'gold',
          sip: 1000
        }
      ])).to.be.true
    })
  })
})
