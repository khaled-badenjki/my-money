const { expect } = require('chai')
const sinon = require('sinon')
const program = require('../../src/commands')
const db = require('../../src/dal/models')

describe('allocate e2e', () => {
  before(async () => {
    await db.sequelize.sync({ force: true })
  })

  after(async () => {
    await db.sequelize.close()
  })
  
  it('should create operations with type "allocations"', async () => {
    await program
      .parseAsync(['node', 'index.js', 'ALLOCATE', '6000', '3000', '1000'])

    const operations = await db.Operation.findAll({
      attributes: ['id', 'type', 'amount'],
      where: {
        type: 'allocation'
      },
      raw: true
    })

    expect(operations.length).to.equal(3)
    expect(operations).to.deep.equal([
      {
        id: 1,
        type: 'allocation',
        amount: 6000
      },
      {
        id: 2,
        type: 'allocation',
        amount: 3000
      },
      {
        id: 3,
        type: 'allocation',
        amount: 1000
      }
    ])
  })
})
