const sinon = require('sinon')
const { expect } = require('chai')
const calculator = require('../../src/helpers/calculator')
const { accountService } = require('../../src/services')
const db = require('../../src/dal/models')


describe('Account Service', () => {
  describe('createManyWithPercentage()', () => {
    const accounts = [
      {
        name: 'equity',
        amount: 6000
      },
      {
        name: 'debt',
        amount: 2000
      },
      {
        name: 'gold',
        amount: 2000
      }
    ]

    const percentages = [ 60, 20, 20 ]

    let accountBulkCreateStub

    before(() => {
      accountBulkCreateStub = sinon.stub(db.Account, 'bulkCreate')
    })

    after(() => {
      accountBulkCreateStub.restore()
    })

    it('should call account model bulk create', async () => {
      accountService.createManyWithPercentage(accounts)
      expect(accountBulkCreateStub.called).to.be.true
    })

    it('should call account model bulk create correct arguments', async () => {
      
      accountService.createManyWithPercentage(accounts)
      
      expect(accountBulkCreateStub.calledWith(
        accounts.map((account, index) => ({
          name: account.name,
          desiredAllocationPercentage: percentages[index]
        }))
      )).to.be.true
    })
  })
})
