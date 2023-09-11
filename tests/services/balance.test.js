const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../../src/dal/models')
const services = require('../../src/services')

describe('balance service', () => {
  let operationFindAllStub
  let accountFindAllStub

  beforeEach(() => {
    operationFindAllStub = sinon.stub(db.Operation, 'findAll')
      .resolves(
        [
          {
            accountId: 3,
            total: '1000',
          },
          {
            accountId: 2,
            total: '3000',
          },
          {
            accountId: 1,
            total: '6000',
          },
        ]
      )

    accountFindAllStub = sinon.stub(db.Account, 'findAll')
      .resolves([
        {
          id: 1,
          name: 'equity'
        },
        {
          id: 2,
          name: 'debt'
        },
        {
          id: 3,
          name: 'gold'
        }
      ])
  })

  afterEach(() => {
    operationFindAllStub.restore()
    accountFindAllStub.restore()
  })

  it('should call operation model to get sum of all accounts', async () => {
    await services.balance('APRIL')
    expect(operationFindAllStub.called).to.be.true
  })

  it('should call account model to get all accounts', async () => {
    await services.balance('APRIL')
    expect(accountFindAllStub.called).to.be.true
  })

  it('should return array of account names and their balances', async () => {
    const result = await services.balance('APRIL')
    expect(result).to.deep.equal([
      {
        name: 'equity',
        balance: '6000'
      },
      {
        name: 'debt',
        balance: '3000'
      },
      {
        name: 'gold',
        balance: '1000'
      }
    ])
    operationFindAllStub.restore()
    accountFindAllStub.restore()
  })
})
