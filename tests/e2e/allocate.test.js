const {expect} = require('chai')
const sinon = require('sinon')
const program = require('../../src/commands')
const db = require('../../src/dal/models')
const logger = require('../../src/helpers/logger')
const {defaults} = require('../../config')

describe('allocate e2e', () => {
  it('should create operations with type "allocations"', async () => {
    await program
        .parseAsync(['node', 'index.js', 'ALLOCATE', '6000', '3000', '1000'])

    const operations = await db.Operation.findAll({
      attributes: ['id', 'type', 'amount'],
      where: {
        type: 'allocation',
      },
      raw: true,
    })

    expect(operations.length).to.equal(3)
    expect(operations).to.deep.equal([
      {
        id: 1,
        type: 'allocation',
        amount: 6000,
      },
      {
        id: 2,
        type: 'allocation',
        amount: 3000,
      },
      {
        id: 3,
        type: 'allocation',
        amount: 1000,
      },
    ])
  })

  it('should set operations date to default allocation date', async () => {
    await program
        .parseAsync(['node', 'index.js', 'ALLOCATE', '6000', '3000', '1000'])

    const operations = await db.Operation.findAll({
      attributes: ['id', 'date'],
      where: {
        type: 'allocation',
      },
      raw: true,
    })

    expect(operations.length).to.equal(3)
    expect(operations[0].date).to.include(defaults.ALLOCATION_DATE)
    expect(operations[1].date).to.include(defaults.ALLOCATION_DATE)
    expect(operations[2].date).to.include(defaults.ALLOCATION_DATE)
  })

  it('should create accounts with desired allocation percentage', async () => {
    await program
        .parseAsync(['node', 'index.js', 'ALLOCATE', '6000', '3000', '1000'])

    const accounts = await db.Account.findAll({
      attributes: ['id', 'name', 'desiredAllocationPercentage'],
      raw: true,
    })

    expect(accounts.length).to.equal(3)
    expect(accounts).to.deep.equal([
      {
        id: 1,
        name: 'equity',
        desiredAllocationPercentage: 60,
      },
      {
        id: 2,
        name: 'debt',
        desiredAllocationPercentage: 30,
      },
      {
        id: 3,
        name: 'gold',
        desiredAllocationPercentage: 10,
      },
    ])
  })

  it('should fail if run more than once', async () => {
    await program
        .parseAsync(['node', 'index.js', 'ALLOCATE', '6000', '3000', '1000'])

    await program
        .parseAsync(['node', 'index.js', 'ALLOCATE', '6000', '3000', '1000'])

    const operations = await db.Operation.findAll({
      attributes: ['id'],
    })

    expect(operations.length).to.equal(3)
    expect(logger.error.calledOnce).to.be.true
    expect(logger.error.args[0][0]).to.equal('ALREADY_ALLOCATED')
  })
})
