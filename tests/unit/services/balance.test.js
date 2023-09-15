const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../../../src/dal/models')
const { balanceService } = require('../../../src/services')
const { months, defaults } = require('../../../config')

describe('balance service', () => {
  const month = months.APRIL
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
    await balanceService.execute(month)
    expect(operationFindAllStub.called).to.be.true
    expect(operationFindAllStub.args[0][0]).to.deep.equal({
      attributes: [
        'accountId',
        [db.sequelize.fn('sum', db.sequelize.col('amount')), 'total']
      ],
      group: ['accountId'],
      raw: true,
      where: {
        date: {
          [db.Sequelize.Op.lte]:  
            `${defaults.YEAR}-${month}-${parseInt(defaults.DAY)+1}`
        }
      }
    })
  })

  it('should call account model to get all accounts', async () => {
    await balanceService.execute(month)
    expect(accountFindAllStub.called).to.be.true
  })

  it('should return array of account names and their balances', async () => {
    const result = await balanceService.execute(month)
    expect(result).to.deep.equal([
      {
        id: 1,
        name: 'equity',
        balance: '6000'
      },
      {
        id: 2,
        name: 'debt',
        balance: '3000'
      },
      {
        id: 3,
        name: 'gold',
        balance: '1000'
      }
    ])
    operationFindAllStub.restore()
    accountFindAllStub.restore()
  })

  it('should order the output as equity -> debt -> gold', async () => {
    accountFindAllStub.restore()
    accountFindAllStub = sinon.stub(db.Account, 'findAll')
      .resolves([
        {
          id: 1,
          name: 'gold'
        },
        {
          id: 2,
          name: 'equity'
        },
        {
          id: 3,
          name: 'debt'
        }
      ])
    const result = await balanceService.execute(month)
    expect(result.map(r => r.name)).to.deep.equal(['equity', 'debt', 'gold'])
  })
})
