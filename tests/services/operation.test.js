const sinon = require('sinon')
const { expect } = require('chai')
const calculator = require('../../src/helpers/calculator')
const { operationService, accountService } = require('../../src/services')
const db = require('../../src/dal/models')

describe('Operation Service', () => {
  describe('createAllocations()', () => {
    let operationBulkCreateStub

    before(() => {
      operationBulkCreateStub = sinon.stub(db.Operation, 'bulkCreate')
    })

    after(() => {
      operationBulkCreateStub.restore()
    })

    it('should call the operation model bulk create', () => {
      const accounts = {
        equity: 100,
        debt: 100,
        gold: 100
      }
      operationService.createAllocations(accounts)
      expect(operationBulkCreateStub.called).to.be.true
    })

    it('should call operation model bulk create with correct arguments', () => {
      const accounts = {
        equity: 6000,
        debt: 2000,
        gold: 2000
      }

      operationService.createAllocations(accounts)

      const expectedOperations = [
        {
          type: 'allocation',
          amount: 6000,
          accountId: 1,
          date: new Date()
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 2,
          date: new Date()
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 3,
          date: new Date()
        }
      ]

      expect(operationBulkCreateStub.calledWith(expectedOperations)).to.be.true
    })
  })
})
