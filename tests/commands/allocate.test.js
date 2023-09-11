const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../../src/dal/models')
const program = require('../../src/commands')
const { logger } = require('../../src/helpers/logger')
const { accountService, operationService } = require('../../src/services')

const callAllocate = async args => 
  program.parseAsync(['node', 'index.js', 'allocate', ...args])

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
  
    it('should throw an error if no arguments are passed', async () => {
      await callAllocate([]) // no arguments
  
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true

    })

    it('should throw an error if the arguments are not numbers', async () => {
      await callAllocate(['a', 'b', 'c'])
  
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if the arguments are not positive', async () => {
      await callAllocate(['-1', '-2', '-3'])

      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })
  })
  
  describe('interaction', () => {
    const params = [
      {
        name: 'equity',
        amount: 6000
      },
      {
        name: 'debt',
        amount: 3000
      },
      {
        name: 'gold',
        amount: 1000
      }
    ]
    const callAllocate = () => program
      .parseAsync(['node', 'index.js', 'allocate',
        params[0].amount,
        params[1].amount,
        params[2].amount
      ])

    let loggerStub
    let accountServiceStub
    let operationServiceStub
  
    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info')
      accountServiceStub = sinon
        .stub(accountService, 'createManyWithPercentage')
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
      await callAllocate()
  
      expect(accountServiceStub.calledWith(params)).to.be.true
    })
  
    it('should call operation service with the correct params', async () => {
      await callAllocate()

      const log = operationServiceStub.args[0][0]
      expect(operationServiceStub.calledWithMatch([
        {
          accountId: 1,
          amount: params[0].amount
        },
        {
          accountId: 2,
          amount: params[1].amount
        },
        {
          accountId: 3,
          amount: params[2].amount
        }
      ])).to.be.true
    })

    it('should floor the amount down if it has decimal places', async () => {
      await program.parseAsync(['node', 'index.js', 
        'allocate', '1000.5', '1000.5', '1000.5'])

      expect(accountServiceStub.calledWith([
        {
          name: 'equity',
          amount: 1000
        },
        {
          name: 'debt',
          amount: 1000
        },
        {
          name: 'gold',
          amount: 1000
        }
      ])).to.be.true
    })
  })
})
