const sinon = require('sinon')
const { expect } = require('chai')
const program = require('../../src/commands')
const { logger } = require('../../src/helpers/logger')
const { accountService, operationService } = require('../../src/services')

const callAllocate = args => 
  program.parseAsync(['node', 'index.js', 'allocate', ...args])

const sampleArgs = [6000, 3000, 1000]

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

    let loggerStub
    let accountCreateManyWithPercentageStub
    let operationCreateAllocationsStub
  
    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info')
      accountCreateManyWithPercentageStub = sinon
        .stub(accountService, 'createManyWithPercentage')
        .resolves([
          { id: 1, name: 'equity', desiredAllocationPercentage: 60 },
          { id: 2, name: 'debt', desiredAllocationPercentage: 20 },
          { id: 3, name: 'gold', desiredAllocationPercentage: 20 }
        ])
      operationCreateAllocationsStub = sinon
        .stub(operationService, 'createAllocations')
        .resolves()
    })
  
    afterEach(() => {
      loggerStub.restore()
      accountCreateManyWithPercentageStub.restore()
      operationCreateAllocationsStub.restore()
    })
  
    it('should log ALLOCATE as info', () => {
      callAllocate(sampleArgs)
  
      expect(loggerStub.calledWith(sinon.match(/allocate/))).to.be.true
    })
  
    it('should call account service with the correct params', async () => {
      await callAllocate(sampleArgs)
  
      expect(accountCreateManyWithPercentageStub.calledWith([
        {
          name: 'equity',
          amount: sampleArgs[0]
        },
        {
          name: 'debt',
          amount: sampleArgs[1]
        },
        {
          name: 'gold',
          amount: sampleArgs[2]
        }
      ])).to.be.true
    })
  
    it('should call operation service with the correct params', async () => {
      await callAllocate(sampleArgs)

      const log = operationCreateAllocationsStub.args[0][0]
      expect(operationCreateAllocationsStub.calledWithMatch([
        {
          accountId: 1,
          amount: sampleArgs[0]
        },
        {
          accountId: 2,
          amount: sampleArgs[1]
        },
        {
          accountId: 3,
          amount: sampleArgs[2]
        }
      ])).to.be.true
    })

    it('should floor the amount down if it has decimal places', async () => {
      await callAllocate([1000.5, 1000.5, 1000.5])

      expect(accountCreateManyWithPercentageStub.calledWithMatch([
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
