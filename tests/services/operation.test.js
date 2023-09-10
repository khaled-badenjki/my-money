const sinon = require('sinon')
const { expect } = require('chai')
const calculator = require('../../src/helpers/calculator')
const { operationService, accountService } = require('../../src/services')
const db = require('../../src/dal/models')

describe('Operation Service', () => {
  describe('createAllocations()', () => {
    let operationBulkCreateStub

    beforeEach(() => {
      operationBulkCreateStub = sinon.stub(db.Operation, 'bulkCreate')
    })

    afterEach(() => {
      operationBulkCreateStub.restore()
    })

    it('should call the operation model bulk create', () => {
      const accounts = {
        equity: {
          id: 1,
          amount: 6000
        },
        debt: {
          id: 2,
          amount: 2000
        },
        gold: {
          id: 3,
          amount: 2000
        }
      }
      operationService.createAllocations(accounts)
      expect(operationBulkCreateStub.called).to.be.true
    })

    it('should call operation bulk create with correct arguments', async () => {
      const accounts = [
        {
          accountId: 1,
          amount: 6000
        },
        {
          accountId: 2,
          amount: 2000
        },
        {
          accountId: 3,
          amount: 2000
        }
      ]

      await operationService.createAllocations(accounts)

      const expectedOperations = [
        {
          type: 'allocation',
          amount: 6000,
          accountId: 1,
          date: sinon.match.date
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 2,
          date: sinon.match.date
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 3,
          date: sinon.match.date
        }
      ]

      expect(operationBulkCreateStub.calledWith(expectedOperations)).to.be.true
    })
  })
})
