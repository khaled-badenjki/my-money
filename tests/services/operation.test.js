const sinon = require('sinon')
const { expect } = require('chai')
const calculator = require('../../src/helpers/calculator')
const { operationService } = require('../../src/services')
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
  })
})
