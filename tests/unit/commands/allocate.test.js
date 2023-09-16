const sinon = require('sinon')
const {expect} = require('chai')
const program = require('../../../src/commands')
const logger = require('../../../src/helpers/logger')
const {allocateService} = require('../../../src/services')
const {errors} = require('../../../config')

const callAllocate = (args) =>
  program.parseAsync(['node', 'index.js', 'ALLOCATE', ...args])

const sampleArgs = [6000, 3000, 1000]

describe('commands/allocate', () => {
  describe('success', () => {
    let allocateServiceStub

    beforeEach(() => {
      allocateServiceStub = sinon
          .stub(allocateService, 'execute').resolves()
    })

    afterEach(() => {
      allocateServiceStub.restore()
    })

    it('should call account service with the correct params', () => {
      callAllocate(sampleArgs)

      expect(allocateServiceStub.args[0][0]).to.deep.equal([
        {
          name: 'equity',
          amount: sampleArgs[0],
        },
        {
          name: 'debt',
          amount: sampleArgs[1],
        },
        {
          name: 'gold',
          amount: sampleArgs[2],
        },
      ])
    })

    it('should floor the amount down if it has decimal places', () => {
      callAllocate(sampleArgs.map((amount) => amount + 0.5))

      expect(allocateServiceStub.args[0][0]).to.deep.equal([
        {
          name: 'equity',
          amount: sampleArgs[0],
        },
        {
          name: 'debt',
          amount: sampleArgs[1],
        },
        {
          name: 'gold',
          amount: sampleArgs[2],
        },
      ])
    })
  })

  describe('failure', () => {
    let allocateServiceStub

    beforeEach(() => {
      allocateServiceStub = sinon
          .stub(allocateService, 'execute')
          .rejects(new Error(errors.ERROR))
    })

    afterEach(() => {
      allocateServiceStub.restore()
    })

    it('should log any error it catches', async () => {
      await callAllocate(sampleArgs)

      expect(logger.error.args[0][0]).to.include(errors.ERROR)
    })
  })
})
