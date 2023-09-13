const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../../src/dal/models')
const { changeService } = require('../../src/services')
const { months, defaults } = require('../../config')

const testData = [
  {
    accountId: 1,
    name: 'equity',
    total: '6240',
    sip: 2000,
    change: -10.00,
    expectedSip: 2000,
    expectedChange: -824
  },
  {
    accountId: 2,
    name: 'debt',
    total: '3300',
    sip: 1000,
    change: 40.00,
    expectedSip: 1000,
    expectedChange: 1720
  },
  {
    accountId: 3,
    name: 'gold',
    total: '1020',
    sip: 500,
    change: 0.00,
    expectedSip: 500,
    expectedChange: 0
  }
]

describe('change service', () => {
  const changeInput = testData.map(data => ({
    name: data.name,
    change: data.change
  }))

  const month = months.APRIL
  
  let operationFindAllStub
  let operationCreateStub
  let accountFindAllStub

  beforeEach(() => {
    operationFindAllStub = sinon.stub(db.Operation, 'findAll')
      .resolves(
        testData.map(data => ({
          accountId: data.accountId,
          total: data.total
        }))
      )
    operationCreateStub = sinon.stub(db.Operation, 'bulkCreate')
    accountFindAllStub = sinon.stub(db.Account, 'findAll')
      .resolves(
        testData.map(data => ({
          id: data.accountId,
          name: data.name,
          sip: data.sip
        }))
      )
  })

  afterEach(() => {
    operationFindAllStub.restore()
    operationCreateStub.restore()
    accountFindAllStub.restore()
  })
  
  it('should call operation model to get sum of all accounts', async () => {
    await changeService.execute(changeInput, month)
    expect(operationFindAllStub.called).to.be.true
  })

  it('should call accounts model to get all accounts', async () => {
    await changeService.execute(changeInput, month)
    expect(accountFindAllStub.called).to.be.true
  })

  it('should call operation bulkCreate with correct arguments', async () => {
    await changeService.execute(changeInput, month)
    expect(operationCreateStub.called).to.be.true
    expect(operationCreateStub.args[0][0]).to.deep.equal(
      testData.map(data => [
        {
          type: 'sip',
          amount: data.expectedSip,
          accountId: data.accountId,
          date: `${defaults.YEAR}-${month}-${defaults.DAY}`
        },
        {
          type: 'change',
          amount: data.expectedChange,
          accountId: data.accountId,
          date: `${defaults.YEAR}-${month}-${defaults.DAY}`
        }
      ]).flat()
    )
  })

  it('should add SIP to balance if SIP starting month or later', async () =>{
    await changeService.execute(changeInput, month)
    expect(operationCreateStub.args[0][0]).to.deep.equal(
      testData.map(data => [
        {
          type: 'sip',
          amount: data.expectedSip,
          accountId: data.accountId,
          date: `${defaults.YEAR}-${month}-${defaults.DAY}`
        },
        {
          type: 'change',
          amount: data.expectedChange,
          accountId: data.accountId,
          date: `${defaults.YEAR}-${month}-${defaults.DAY}`
        }
      ]).flat()
    )
  })
})
