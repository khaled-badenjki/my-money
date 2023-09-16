const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const {expect} = chai
const db = require('../../../src/dal/models')
const {sipService} = require('../../../src/services')

describe('sip service', () => {
  const accountSip = [
    {
      name: 'equity',
      sip: 6000,
    },
    {
      name: 'debt',
      sip: 2000,
    },
    {
      name: 'gold',
      sip: 2000,
    },
  ]

  let accountUpdateStub
  let accountFindOneStub

  beforeEach(() => {
    accountUpdateStub = sinon.stub(db.Account, 'update')
        .resolves([1])
    accountFindOneStub = sinon.stub(db.Account, 'findAll').resolves([
      {
        monthlyInvestment: null,
      },
    ])
  })

  afterEach(() => {
    accountUpdateStub.restore()
    accountFindOneStub.restore()
  })

  it('should call account model to update monthly investment', async () => {
    await sipService.execute(accountSip)

    expect(accountUpdateStub.called).to.be.true
  })

  it('should fail if monthly investment is already set', async () => {
    accountFindOneStub.resolves({
      monthlyInvestment: 1000,
    })
    await expect(sipService.execute(accountSip))
        .to.be.rejectedWith(Error)
  })
})
