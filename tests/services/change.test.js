const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../../src/dal/models')
const services = require('../../src/services')

describe('change service', () => {
  const changeInput = [[
    {
      name: 'equity',
      change: 4
    },
    {
      name: 'debt',
      change: 10
    },
    {
      name: 'gold',
      change: 2
    }
  ], 'APRIL']
  
  let operationFindAllStub
  let operationCreateStub
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
    operationCreateStub = sinon.stub(db.Operation, 'bulkCreate')
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
    operationCreateStub.restore()
    accountFindAllStub.restore()
  })
  
  it('should call operation model to get sum of all accounts', async () => {
    await services.change(...changeInput)
    expect(operationFindAllStub.called).to.be.true
  })

  it('should call accounts model to get all accounts', async () => {
    await services.change(...changeInput)
    expect(accountFindAllStub.called).to.be.true
  })

  it('should call operation bulkCreate with correct arguments', async () => {
    await services.change(...changeInput)
    expect(operationCreateStub.called).to.be.true
    expect(operationCreateStub.calledWith(
      [
        {
          type: 'change',
          amount: 240,
          accountId: 1,
          date: '2023-04-15',
        },
        {
          type: 'change',
          amount: 300,
          accountId: 2,
          date: '2023-04-15',
        },
        {
          type: 'change',
          amount: 20,
          accountId: 3,
          date: '2023-04-15',
        },
      ]
    )).to.be.true
  })
})
