const sinon = require('sinon')
const {expect} = require('chai')
const db = require('../../../src/dal/models')
const {balanceService} = require('../../../src/services')
const {months, defaults} = require('../../../config')

describe('balance service', () => {
  const month = months.APRIL
  let operationFindAllStub

  beforeEach(() => {
    operationFindAllStub = sinon.stub(db.Operation, 'findAll')
        .resolves(
            [
              {
                accountId: 1,
                accountName: 'equity',
                balance: '6000',
              },
              {
                accountId: 2,
                accountName: 'debt',
                balance: '3000',
              },
              {
                accountId: 3,
                accountName: 'gold',
                balance: '1000',
              },
            ],
        )
  })

  afterEach(() => {
    operationFindAllStub.restore()
  })

  it('should call operation model to get sum of all accounts', async () => {
    await balanceService.execute(month)
    expect(operationFindAllStub.called).to.be.true
    expect(operationFindAllStub.args[0][0]).to.deep.equal({
      attributes: [
        'accountId',
        [db.sequelize.fn('sum', db.sequelize.col('amount')), 'balance'],
        [db.sequelize.literal('account.name'), 'accountName'],
      ],
      include: [{
        model: db.Account,
        attributes: [],
        as: 'account',
      }],
      group: ['accountId', 'account.name'],
      raw: true,
      where: {
        date: {
          [db.Sequelize.Op.lte]:
            `${defaults.YEAR}-${month}-${parseInt(defaults.DAY)+1}`,
        },
      },
    })
  })

  it('should return array of account names and their balances', async () => {
    const result = await balanceService.execute(month)
    expect(result).to.deep.equal([
      {
        accountId: 1,
        accountName: 'equity',
        balance: '6000',
      },
      {
        accountId: 2,
        accountName: 'debt',
        balance: '3000',
      },
      {
        accountId: 3,
        accountName: 'gold',
        balance: '1000',
      },
    ])
  })
})
