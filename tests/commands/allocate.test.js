const sinon = require('sinon')
const { expect } = require('chai')
const program = require('../../src/commands')
const { logger } = require('../../src/helpers/logger')
const services = require('../../src/services')

const callAllocate = args => 
  program.parseAsync(['node', 'index.js', 'ALLOCATE', ...args])

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
  
    it('should throw an error if no arguments are passed', () => {
      callAllocate([]) // no arguments
  
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true

    })

    it('should throw an error if the arguments are not numbers', () => {
      callAllocate(['a', 'b', 'c'])
  
      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })

    it('should throw an error if the arguments are not positive', () => {
      callAllocate(['-1', '-2', '-3'])

      expect(loggerStub.calledWith(sinon.match(/Invalid input/))).to.be.true
    })
  })
  
  describe('interaction', () => {

    let loggerStub
    let allocateServiceStub
  
    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info')
      allocateServiceStub = sinon
        .stub(services, 'allocate')
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
})
