const sinon = require('sinon')
const { expect } = require('chai')
const program = require('../../src/commands')
const logger = require('../../src/helpers/logger')
const { accountService, operationService } = require('../../src/services')

describe('commands/allocate', () => {
  describe('input validation', () => {
    let loggerStub
    let processExitStub
  
    before(() => {
      loggerStub = sinon.stub(logger, 'error')
      processExitStub = sinon.stub(process, 'exit')

    })
  
    after(() => {
      loggerStub.restore()
      processExitStub.restore()
    })
  
    it('should throw an error if no arguments are passed', () => {
      program.parse(['node', 'index.js', 'allocate'])
  
      processExitStub.callsFake((code) => {
        expect(code).to.equal(1) // Check that the exit code is 1
      })
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true

    })
  })
  
  describe('interaction', () => {
    let loggerStub
    let accountServiceStub
    let operationServiceStub
  
    before(() => {
      loggerStub = sinon.stub(logger, 'info')
      accountServiceStub = sinon
        .stub(accountService, 'setDesiredAllocationPercentage')
        .resolves()
      operationServiceStub = sinon
        .stub(operationService, 'createAllocations')
        .resolves()
    })
  
    after(() => {
      loggerStub.restore()
      accountServiceStub.restore()
      operationServiceStub.restore()
    })
  
    it('should log ALLOCATE as info', () => {
      program.parse(['node', 'index.js', 'allocate', '6000', '3000', '1000'])
  
      expect(loggerStub.calledWith(sinon.match(/allocate/))).to.be.true
    })
  
    it ('should call the account service with the correct params', () => {
      const params = {
        equity: '6000',
        debt: '3000',
        gold: '1000'
      }
  
      program.parse(['node', 'index.js', 'allocate',
        params.equity, 
        params.debt, 
        params.gold
      ])
  
      expect(accountServiceStub.calledWith({
        equity: params.equity, 
        debt: params.debt, 
        gold: params.gold
      })).to.be.true
    })
  
    it('should call the operation service with the correct params', () => {
      const params = {
        equity: '6000',
        debt: '3000',
        gold: '1000'
      }
  
      program.parse(['node', 'index.js', 'allocate',
        params.equity, 
        params.debt, 
        params.gold
      ])
  
      expect(operationServiceStub.calledWith({
        equity: params.equity, 
        debt: params.debt, 
        gold: params.gold
      })).to.be.true
    })
  })
})
