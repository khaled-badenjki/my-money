const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')
const { accountService } = require('../../src/services')

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

    it('should throw an error if no arguments are passed', () => {
      program.parse(['node', 'index.js', 'sip'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if the arguments are not numbers', () => {
      program.parse(['node', 'index.js', 'sip', 'a', 'b', 'c'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if the arguments are not positive', () => {
      program.parse(['node', 'index.js', 'sip', '-1', '-2', '-3'])
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

    it('should log sip as info', () => {
      program.parse(['node', 'index.js', 'sip', '1000', '1000', '1000'])
      expect(loggerStub.calledWith(sinon.match(/sip/))).to.be.true
      loggerStub.restore()
    })
  })
})
