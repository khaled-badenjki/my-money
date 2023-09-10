const sinon = require('sinon')
const { expect } = require('chai')
const calculator = require('../../src/helpers/calculator')
const { operationService, accountService } = require('../../src/services')
const db = require('../../src/dal/models')

describe('Operation Service', () => {
  describe('createAllocations()', () => {
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

    let operationBulkCreateStub

    beforeEach(() => {
      operationBulkCreateStub = sinon.stub(db.Operation, 'bulkCreate')
    })

    afterEach(() => {
      operationBulkCreateStub.restore()
    })

    it('should call the operation model bulk create', () => {

      operationService.createAllocations(accounts)
      expect(operationBulkCreateStub.called).to.be.true
    })

    it('should call operation bulk create with correct arguments', async () => {
      
      await operationService.createAllocations(accounts)

      const expectedOperations = 

      expect(operationBulkCreateStub.calledWith([
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
      ])).to.be.true
    })

    it('should store allocation date as 15th of January 2023', async () => {

      await operationService.createAllocations(accounts)

      expect(operationBulkCreateStub.calledWith([
        {
          type: 'allocation',
          amount: 6000,
          accountId: 1,
          date: new Date(2023, 0, 15)
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 2,
          date: new Date(2023, 0, 15)
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 3,
          date: new Date(2023, 0, 15)
        }
      ])).to.be.true
    })
  })
})
