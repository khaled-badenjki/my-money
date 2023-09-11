const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../../src/dal/models')
const { sipService } = require('../../src/services')

describe('sip service', () => {
  const accountSip = [
    {
      name: 'equity',
      sip: 6000
    },
    {
      name: 'debt',
      sip: 2000
    },
    {
      name: 'gold',
      sip: 2000
    }
  ]

  let accountUpdateStub

  beforeEach(() => {
    accountUpdateStub = sinon.stub(db.Account, 'update')
  })

  afterEach(() => {
    accountUpdateStub.restore()
  })

  it('should call account model to update monthly investment', async () => {
    await sipService.execute(accountSip)

    expect(accountUpdateStub.called).to.be.true
  })
})
