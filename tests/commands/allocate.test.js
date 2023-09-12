const sinon = require('sinon')
const { expect } = require('chai')
const program = require('../../src/commands')
const { logger } = require('../../src/helpers/logger')
const { allocateService } = require('../../src/services')

const callAllocate = args => 
  program.parseAsync(['node', 'index.js', 'ALLOCATE', ...args])

const sampleArgs = [6000, 3000, 1000]

describe('commands/allocate', () => {
  describe('success', () => {

    let loggerStub
    let allocateServiceStub
  
    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info')
      allocateServiceStub = sinon
        .stub(allocateService, 'execute')
        .resolves([
          { id: 1, name: 'equity', desiredAllocationPercentage: 60 },
          { id: 2, name: 'debt', desiredAllocationPercentage: 20 },
          { id: 3, name: 'gold', desiredAllocationPercentage: 20 }
        ])
    })
  
    afterEach(() => {
      loggerStub.restore()
      allocateServiceStub.restore()
    })
  
    it('should log ALLOCATE as info', () => {
      callAllocate(sampleArgs)
  
      expect(loggerStub.calledWith(sinon.match(/ALLOCATE/))).to.be.true
    })
  
    it('should call account service with the correct params', () => {
      callAllocate(sampleArgs)
  
      expect(allocateServiceStub.calledWith([
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

    it('should floor the amount down if it has decimal places', () => {
      callAllocate([1000.5, 1000.5, 1000.5])

      expect(allocateServiceStub.calledWithMatch([
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

  describe('failure', () => {
    let loggerStub
    let allocateServiceStub
  
    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info')
      allocateServiceStub = sinon
        .stub(allocateService, 'execute')
        .rejects(new Error('Invalid input'))
    })
  
    afterEach(() => {
      loggerStub.restore()
      allocateServiceStub.restore()
    })

    it('should log error message', async () => {
      await callAllocate(sampleArgs)

      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })
  })
})
