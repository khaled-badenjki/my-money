const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../../src/dal/models')
const services = require('../../src/services')

describe('services', () => {
  describe('allocate service', () => {
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

    it('should call account model to create accounts', () => {
      services.allocate(accounts)
      expect(accountBulkCreateStub.called).to.be.true
    })
  })
})
