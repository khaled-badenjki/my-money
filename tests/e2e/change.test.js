const { expect } = require('chai')
const sinon = require('sinon')
const program = require('../../src/commands')
const db = require('../../src/dal/models')
const logger = require('../../src/helpers/logger')
const { defaults } = require('../../config')

const runCommand = (command, args) => program
    .parseAsync(['node', 'index.js', command, ...args])

describe('CHANGE e2e', () => {
  it('should insert new operation', async () => {
    await runCommand('ALLOCATE', ['6000', '3000', '1000'])
    await runCommand('SIP', ['2000', '1000', '500'])

    await runCommand('CHANGE', ['4.00%', '10.00%', '2.00%', 'JANUARY'])

    const operations = await db.Operation.findAll({
      where: { type: 'change' }
    })

    expect(operations.length).to.be.equal(3)
  })

  it('should fail if previous month is not set', async () => {
    await runCommand('ALLOCATE', ['6000', '3000', '1000'])
    await runCommand('SIP', ['2000', '1000', '500'])

    await runCommand('CHANGE', ['4.00%', '10.00%', '2.00%', 'JANUARY'])

    // skip February

    await runCommand('CHANGE', ['4.00%', '10.00%', '2.00%', 'MARCH'])
    
    expect(logger.error.args[0][0]).to.be.equal('PREVIOUS_MONTH_NOT_SET')
  })
})
