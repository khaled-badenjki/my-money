const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../../src/dal/models')
const program = require('../../src/commands')
const { logger } = require('../../src/helpers/logger')
const { accountService, operationService } = require('../../src/services')

describe('commands/allocate', () => {
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
      program.parse(['node', 'index.js', 'allocate'])
  
      processExitStub.callsFake((code) => {
        expect(code).to.equal(1)
      })
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true

    })

    it('should throw an error if the arguments are not numbers', () => {
      program.parse(['node', 'index.js', 'allocate', 'a', 'b', 'c'])
  
      processExitStub.callsFake((code) => {
        expect(code).to.equal(1)
      })
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if the arguments are not positive', () => {
      program.parse(['node', 'index.js', 'allocate', '-1', '-2', '-3'])
  
      processExitStub.callsFake((code) => {
        expect(code).to.equal(1)
      })
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })
  })
  
  describe('interaction', () => {
    let loggerStub
    let accountServiceStub
    let operationServiceStub
  
    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info')
      accountServiceStub = sinon
        .stub(accountService, 'setDesiredAllocationPercentage')
        .resolves([
          { id: 1, name: 'equity', desiredAllocationPercentage: 60 },
          { id: 2, name: 'debt', desiredAllocationPercentage: 20 },
          { id: 3, name: 'gold', desiredAllocationPercentage: 20 }
        ])
      operationServiceStub = sinon
        .stub(operationService, 'createAllocations')
        .resolves()
    })
  
    afterEach(() => {
      loggerStub.restore()
      accountServiceStub.restore()
      operationServiceStub.restore()
    })
  
    it('should log ALLOCATE as info', () => {
      program.parse(['node', 'index.js', 'allocate', '6000', '3000', '1000'])
  
      expect(loggerStub.calledWith(sinon.match(/allocate/))).to.be.true
    })
  
    it ('should call account service with the correct params', async () => {
      const params = {
        equity: '6000',
        debt: '3000',
        gold: '1000'
      }
  
      await program.parseAsync(['node', 'index.js', 'allocate',
        params.equity, 
        params.debt, 
        params.gold
      ])
  
      console.log(accountServiceStub.getCall(0))
      expect(accountServiceStub.calledWith([
        {
          name: 'equity',
          amount: params.equity
        },
        {
          name: 'debt',
          amount: params.debt
        },
        {
          name: 'gold',
          amount: params.gold
        }
      ])).to.be.true
    })
  
    it('should call operation service with the correct params', async () => {
      const params = {
        equity: '6000',
        debt: '3000',
        gold: '1000'
      }
  
      await program.parseAsync(['node', 'index.js', 'allocate',
        params.equity, 
        params.debt, 
        params.gold
      ])
  
      const log = operationServiceStub.getCall(0)
      expect(operationServiceStub.calledWith({
        equity: {
          id: 1,
          amount: params.equity
        },
        debt: {
          id: 2,
          amount: params.debt
        },
        gold: {
          id: 3,
          amount: params.gold
        }
      })).to.be.true
    })

    it('should close the database connection', async () => {
      const dbCloseStub = sinon.stub(db.sequelize, 'close')

      await program.parseAsync(['node', 'index.js', 'allocate', 
        '6000', '3000', '1000'])

      expect(dbCloseStub.calledOnce).to.be.true
      dbCloseStub.restore()
    })
  })
})
