const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')

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
      program.parse(['node', 'index.js', 'change'])
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })
  })
})
