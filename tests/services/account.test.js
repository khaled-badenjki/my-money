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

    it('should call account model bulk create correct arguments', async () => {
      const accounts = {
        equity: 6000,
        debt: 2000,
        gold: 2000
      }
      accountService.setDesiredAllocationPercentage(accounts)
      expect(accountBulkCreateStub.calledWith([
        { name: 'equity', percentage: 60 },
        { name: 'debt', percentage: 20 },
        { name: 'gold', percentage: 20 }
      ])).to.be.true
    })
  })
})
