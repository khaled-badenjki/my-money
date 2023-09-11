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
    let dbCloseStub

    beforeEach(() => {
      accountBulkCreateStub = sinon.stub(db.Account, 'bulkCreate')
      dbCloseStub = sinon.stub(db.sequelize, 'close')
    })

    afterEach(() => {
      accountBulkCreateStub.restore()
      expect(dbCloseStub.calledOnce).to.be.true
      dbCloseStub.restore()
    })

    it('should call account model bulk create', async () => {
      accountService.createManyWithPercentage(accounts)
      expect(accountBulkCreateStub.called).to.be.true
    })

    it('should call account bulk create with correct arguments', async () => {
      accountService.createManyWithPercentage(accounts)
      
      expect(accountBulkCreateStub.calledWith(
        accounts.map((account, index) => ({
          name: account.name,
          desiredAllocationPercentage: percentages[index]
        }))
      )).to.be.true
    })
  })

  describe('setSip()', () => {
    before(() => {
      sinon.stub(db.Account, 'update').resolves()
    })

    after(() => {
      db.Account.update.restore()
    })

    it('should call account model update with correct arguments', async () => {
      const accountSip = [
        {
          name: 'equity',
          sip: 6000
        },
        {
          name: 'debt',
          sip: 2000
        },
        {
          name: 'gold',
          sip: 2000
        }
      ]

      await accountService.setSip(accountSip)

      expect(db.Account.update.calledWith(
        { monthlyInvestment: 6000 },
        { where: { name: 'equity' } }
      )).to.be.true

      expect(db.Account.update.calledWith(
        { monthlyInvestment: 2000 },
        { where: { name: 'debt' } }
      )).to.be.true

      expect(db.Account.update.calledWith(
        { monthlyInvestment: 2000 },
        { where: { name: 'gold' } }
      )).to.be.true
    })
  })
})
