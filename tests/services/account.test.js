const sinon = require('sinon')
const { expect } = require('chai')
const calculator = require('../../src/helpers/calculator')
const { accountService } = require('../../src/services')
const db = require('../../src/dal/models')


describe('Account Service', () => {
  describe('setDesiredAllocationPercentage()', () => {
    let calculatorStub
    let accountBulkCreateStub

    before(() => {
      calculatorStub = sinon.stub(calculator, 'calculatePercentages')
      accountBulkCreateStub = sinon.stub(db.Account, 'bulkCreate')
    })

    after(() => {
      calculatorStub.restore()
      accountBulkCreateStub.restore()
    })

    it('should call the calculator helper to calculate percentages', () => {
      const accounts = {
        equity: 100,
        debt: 100,
        gold: 100
      }
      accountService.setDesiredAllocationPercentage(accounts)
      expect(calculatorStub.calledOnce).to.be.true
    })

    it('should call account model bulk create', async () => {
      const accounts = {
        equity: 100,
        debt: 100,
        gold: 100
      }
      accountService.setDesiredAllocationPercentage(accounts)
      expect(accountBulkCreateStub.called).to.be.true
    })
  })
})
