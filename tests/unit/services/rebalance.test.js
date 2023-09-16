const {expect} = require('chai')
const sinon = require('sinon')
const {rebalanceService} = require('../../../src/services')
const db = require('../../../src/dal/models')

describe('services/rebalance', () => {
  it('should throw an error "CANNOT_REBALANCE"' +
    ' if no records are found in December or June', async () => {
    sinon.stub(db.Operation, 'findOne').resolves({latestDate: null})

    await expect(rebalanceService.execute()).to.be.rejectedWith(
        'CANNOT_REBALANCE',
    )

    db.Operation.findOne.restore()
  })
})
