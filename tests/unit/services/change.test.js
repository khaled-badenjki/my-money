const sinon = require('sinon')
const {expect} = require('chai')
const db = require('../../../src/dal/models')
const {changeService} = require('../../../src/services')
const {months, defaults} = require('../../../config')

const testData = [
  {
    accountId: 1,
    name: 'equity',
    total: 6240,
    monthlyInvestment: 2000,
    percentage: -10.00,
    expectedSip: 2000,
    expectedChangeBeforeSip: -624,
    expectedChangeAfterSip: -824,
  },
  {
    accountId: 2,
    name: 'debt',
    total: 3300,
    monthlyInvestment: 1000,
    percentage: 40.00,
    expectedSip: 1000,
    expectedChangeBeforeSip: 1320,
    expectedChangeAfterSip: 1720,
  },
  {
    accountId: 3,
    name: 'gold',
    total: 1020,
    monthlyInvestment: 500,
    percentage: 0.00,
    expectedSip: 500,
    expectedChangeBeforeSip: 0,
    expectedChangeAfterSip: 0,
  },
]

describe('change service', () => {
  const changeInput = testData.map((data) => ({
    name: data.name,
    percentage: data.percentage,
  }))

  let month = months.JANUARY

  let operationFindAllStub
  let operationCreateStub
  let accountFindAllStub

  beforeEach(() => {
    operationCreateStub = sinon.stub(db.Operation, 'bulkCreate')
    accountFindAllStub = sinon.stub(db.Account, 'findAll')
        .resolves(
            testData.map((data) => ({
              id: data.accountId,
              name: data.name,
              monthlyInvestment: data.monthlyInvestment,
              balance: data.total,
            })),
        )
  })

  afterEach(() => {
    operationCreateStub.restore()
    accountFindAllStub.restore()
  })

  it('should call accounts model to get all accounts', async () => {
    await changeService.execute(changeInput, month)
    expect(accountFindAllStub.called).to.be.true
  })

  it('should throw error if no accounts found', async () => {
    accountFindAllStub.resolves([])
    await expect(changeService.execute(changeInput, month))
        .to.be.rejectedWith(Error)
  })

  it('should not add SIP to balance if before SIP starting month', async () => {
    month = months.JANUARY
    await changeService.execute(changeInput, month)
    expect(operationCreateStub.args[0][0]).to.deep.equal(
        testData.map((data) => [
          {
            type: 'change',
            amount: data.expectedChangeBeforeSip,
            accountId: data.accountId,
            date: `${defaults.YEAR}-${month}-${defaults.DAY}`,
          },
        ]).flat(),
    )
  })
})
