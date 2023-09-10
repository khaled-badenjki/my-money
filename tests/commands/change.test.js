const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')

describe('commands/change', () => {
  const callChange = args => 
    program.parse(['node', 'index.js', 'change', ...args])

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
      program.parse(['node', 'index.js', 'change'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if first 3 args are not percentages', () => {
      program.parse(['node', 'index.js', 'change', '10', '20', '30', 'APRIL'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should fail if percentages are out of range', () => {
      callChange(['101%', '20%', '30%', 'APRIL'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })
  })
})
