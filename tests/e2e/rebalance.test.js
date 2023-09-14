const { expect } = require('chai')
const sinon = require('sinon')
const program = require('../../src/commands')
const db = require('../../src/dal/models')
const logger = require('../../src/helpers/logger')
const { defaults } = require('../../config')

const runCommand = (command, args) => program
    .parseAsync(['node', 'index.js', command, ...args])

describe('rebalance e2e', () => {
  it('should log CANNOT_REBALANCE if 6 months data is unvailable', async () => {
    await runCommand('ALLOCATE', ['8000', '6000', '3500'])

    await runCommand('SIP', ['3000', '2000', '1000'])

    await runCommand('CHANGE', ['11.00%', '9.00%', '4.00%', 'JANUARY'])

    await runCommand('CHANGE', ['--', '-6.00%', '21.00%', '-3.00%', 'FEBRUARY'])

    await runCommand('CHANGE', ['12.50%', '18.00%', '12.50%', 'MARCH'])

    await runCommand('CHANGE', ['--', '23.00%', '-3.00%', '7.00%', 'APRIL'])

    await runCommand('REBALANCE', [])

    expect(logger.info.calledOnceWith('CANNOT_REBALANCE')).to.be.true
  })
})
