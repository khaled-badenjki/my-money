const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const {expect} = chai
const db = require('../../../src/dal/models')
const {allocateService} = require('../../../src/services')
const {errors} = require('../../../config')

describe('allocate service', () => {
  const ALLOCATION_DATE = '2023-01-15'
  const accounts = [
    {
      name: 'equity',
      amount: 6000,
    },
    {
      name: 'debt',
      amount: 2000,
    },
    {
      name: 'gold',
      amount: 2000,
    },
  ]

  let accountBulkCreateStub
  let operationBulkCreateStub
  let transactionStub

  beforeEach(() => {
    accountBulkCreateStub = sinon.stub(db.Account, 'bulkCreate')
        .resolves(accounts.map((account, index) => ({
          id: index + 1,
          name: account.name,
          desiredAllocationPercentage: 0,
        })))
    operationBulkCreateStub = sinon.stub(db.Operation, 'bulkCreate')
    transactionStub = sinon.stub(db.sequelize, 'transaction')
        .resolves({commit: () => {}})
  })

  afterEach(() => {
    accountBulkCreateStub.restore()
    operationBulkCreateStub.restore()
    transactionStub.restore()
  })

  it('should call account model to create accounts', async () => {
    await allocateService.execute(accounts)
    expect(accountBulkCreateStub.called).to.be.true
    expect(accountBulkCreateStub.args[0][0]).to.deep.equal([
      {
        name: 'equity',
        desiredAllocationPercentage: 60,
      },
      {
        name: 'debt',
        desiredAllocationPercentage: 20,
      },
      {
        name: 'gold',
        desiredAllocationPercentage: 20,
      },
    ])
  })

  it('should call operation model to create operations', async () => {
    await allocateService.execute(accounts)
    expect(operationBulkCreateStub.called).to.be.true
    expect(operationBulkCreateStub.args[0][0]).to.deep.equal([
      {
        type: 'allocation',
        amount: 6000,
        accountId: 1,
        date: ALLOCATION_DATE,
      },
      {
        type: 'allocation',
        amount: 2000,
        accountId: 2,
        date: ALLOCATION_DATE,
      },
      {
        type: 'allocation',
        amount: 2000,
        accountId: 3,
        date: ALLOCATION_DATE,
      },
    ])
  })

  it('should fail if there are already accounts', async () => {
    accountBulkCreateStub.restore()
    accountBulkCreateStub = sinon.stub(db.Account, 'bulkCreate')
        .rejects(new Error(errors.ALREADY_ALLOCATED))

    await expect(allocateService.execute(accounts))
        .to.be.rejectedWith(errors.ALREADY_ALLOCATED)
  })
})
