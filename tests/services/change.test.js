const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../../src/dal/models')
const { changeService } = require('../../src/services')

const SIP_START_MONTH = '2'

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
            accountId: 1,
            total: '6240',
          },
          {
            accountId: 2,
            total: '3300',
          },
          {
            accountId: 3,
            total: '1020',
          }
        ]
      )
    operationCreateStub = sinon.stub(db.Operation, 'bulkCreate')
    accountFindAllStub = sinon.stub(db.Account, 'findAll')
      .resolves([
        {
          id: 1,
          name: 'equity',
          sip: 2000,
        },
        {
          id: 2,
          name: 'debt',
          sip: 1000,
        },
        {
          id: 3,
          name: 'gold',
          sip: 500,
        }
      ])
  })

  afterEach(() => {
    operationFindAllStub.restore()
    operationCreateStub.restore()
    accountFindAllStub.restore()
  })
  
  it('should call operation model to get sum of all accounts', async () => {
    await changeService.execute(...changeInput)
    expect(operationFindAllStub.called).to.be.true
  })

  it('should call accounts model to get all accounts', async () => {
    await changeService.execute(...changeInput)
    expect(accountFindAllStub.called).to.be.true
  })

  it('should call operation bulkCreate with correct arguments', async () => {
    await changeService.execute(...changeInput)
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

  it('should add SIP to balance if SIP starting month or later', async () =>{
    await changeService.execute([
      {
        name: 'equity',
        change: -10.00
      },{
        name: 'debt',
        change: 40.00
      },
      {
        name: 'gold',
        change: 0.00
      }
  ], 'FEBRUARY')
    expect(operationCreateStub.calledWith(
      [
        {
          type: 'change',
          amount: -824,
          accountId: 1,
          date: '2023-02-15',
        },
        {
          type: 'sip',
          amount: 2000,
          accountId: 1,
          date: '2023-02-15',
        },
        {
          type: 'change',
          amount: 1720,
          accountId: 2,
          date: '2023-02-15',
        },
        {
          type: 'sip',
          amount: 1000,
          accountId: 2,
          date: '2023-02-15',
        },
        {
          type: 'change',
          amount: 0,
          accountId: 3,
          date: '2023-02-15',
        },
        {
          type: 'sip',
          amount: 500,
          accountId: 3,
          date: '2023-02-15',
        },
      ]
    )).to.be.true
  })
})
