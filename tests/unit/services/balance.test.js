const sinon = require('sinon')
const {expect} = require('chai')
const db = require('../../../src/dal/models')
const {balanceService} = require('../../../src/services')
const {months, defaults} = require('../../../config')

describe('balance service', () => {
  const month = months.APRIL
  let accountFindAllStub

  beforeEach(() => {
    accountFindAllStub = sinon.stub(db.Account, 'findAll')
        .resolves(
            [
              {
                id: 1,
                name: 'equity',
                monthlyInvestment: 2000,
                desiredAllocationPercentage: 60,
                balance: 6000,
              },
              {
                id: 2,
                name: 'debt',
                monthlyInvestment: 1000,
                desiredAllocationPercentage: 30,
                balance: 3000,
              },
              {
                id: 3,
                name: 'gold',
                monthlyInvestment: 500,
                desiredAllocationPercentage: 10,
                balance: 1000,
              },
            ],
        )
  })

  afterEach(() => {
    accountFindAllStub.restore()
  })

  it('should return array of account names and their balances', async () => {
    const result = await balanceService.execute(month)
    expect(result).to.deep.equal([
      {
        id: 1,
        name: 'equity',
        balance: 6000,
        monthlyInvestment: 2000,
        desiredAllocationPercentage: 60,
      },
      {
        id: 2,
        name: 'debt',
        balance: 3000,
        monthlyInvestment: 1000,
        desiredAllocationPercentage: 30,
      },
      {
        id: 3,
        name: 'gold',
        balance: 1000,
        monthlyInvestment: 500,
        desiredAllocationPercentage: 10,
      },
    ])
  })
})
