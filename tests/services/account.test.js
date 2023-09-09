const sinon = require('sinon')
const { expect } = require('chai')
const calculator = require('../../src/helpers/calculator')
const { accountService } = require('../../src/services')


describe('Account Service', () => {
  describe('setDesiredAllocationPercentage()', () => {
    let calculatorStub

    before(() => {
      calculatorStub = sinon.stub(calculator, 'calculatePercentages')
    })

    after(() => {
      calculatorStub.restore()
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
  })
})
