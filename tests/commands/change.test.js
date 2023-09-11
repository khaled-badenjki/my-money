const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')
const services = require('../../src/services')

const callChange = args => 
  program.parseAsync(['node', 'index.js', 'CHANGE', ...args])

describe('commands/change', () => {

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
      callChange([])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if first 3 args are not percentages', () => {
      callChange(['10', '20', '30', 'APRIL'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should fail if percentages are out of range', () => {
      callChange(['101%', '20%', '30%', 'APRIL'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })
  })

  describe('interaction', () => {
    it('should call the services.change', () => {
      sinon.stub(services, 'change')

      callChange(['10%', '20%', '30%', 'APRIL'])
      expect(services.change.calledOnce).to.be.true
    })
  })
})
