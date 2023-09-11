const sinon = require('sinon')
const { expect } = require('chai')
const calculator = require('../../src/helpers/calculator')
const { operationService, accountService } = require('../../src/services')
const db = require('../../src/dal/models')

describe('Operation Service', () => {
  describe('createAllocations()', () => {
    const ALLOCATION_DATE = '2023-01-15'
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
    let dbCloseStub

    beforeEach(() => {
      operationBulkCreateStub = sinon.stub(db.Operation, 'bulkCreate')
      dbCloseStub = sinon.stub(db.sequelize, 'close')
    })

    afterEach(() => {
      operationBulkCreateStub.restore()
      expect(dbCloseStub.calledOnce).to.be.true
      dbCloseStub.restore()
    })

    it('should call the operation model bulk create', () => {

      operationService.createAllocations(accounts)
      expect(operationBulkCreateStub.called).to.be.true
    })

    it('should call operation bulk create with correct arguments', async () => {
      
      await operationService.createAllocations(accounts)

      expect(operationBulkCreateStub.calledWith([
        {
          type: 'allocation',
          amount: 6000,
          accountId: 1,
          date: ALLOCATION_DATE
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 2,
          date: ALLOCATION_DATE
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 3,
          date: ALLOCATION_DATE
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
          date: ALLOCATION_DATE
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 2,
          date: ALLOCATION_DATE
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 3,
          date: ALLOCATION_DATE
        }
      ])).to.be.true
    })
  })
})
