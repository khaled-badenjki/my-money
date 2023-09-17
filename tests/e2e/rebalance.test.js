const {expect} = require('chai')
const program = require('../../src/commands')
const db = require('../../src/dal/models')
const logger = require('../../src/helpers/logger')

const runCommand = (command, args) => program
    .parseAsync(['node', 'index.js', command, ...args])

describe('rebalance e2e', () => {
  it('should log CANNOT_REBALANCE if no data is available', async () => {
    await runCommand('REBALANCE', [])

    expect(logger.error.calledOnceWith('CANNOT_REBALANCE')).to.be.true
  })

  it('should log CANNOT_REBALANCE if 6 months data is unvailable', async () => {
    await runCommand('ALLOCATE', ['8000', '6000', '3500'])

    await runCommand('SIP', ['3000', '2000', '1000'])

    await runCommand('CHANGE', ['11.00%', '9.00%', '4.00%', 'JANUARY'])

    await runCommand('CHANGE', ['--', '-6.00%', '21.00%', '-3.00%', 'FEBRUARY'])

    await runCommand('CHANGE', ['12.50%', '18.00%', '12.50%', 'MARCH'])

    await runCommand('CHANGE', ['--', '23.00%', '-3.00%', '7.00%', 'APRIL'])

    await runCommand('REBALANCE', [])

    expect(logger.error.calledOnceWith('CANNOT_REBALANCE')).to.be.true
  })

  it('should calculate rebalance amount correctly', async () => {
    await runCommand('ALLOCATE', ['6000', '3000', '1000'])

    await runCommand('SIP', ['2000', '1000', '500'])

    await runCommand('CHANGE', ['4.00%', '10.00%', '2.00%', 'JANUARY'])

    await runCommand('CHANGE', ['--', '-10.00%', '40.00%', '0.00%', 'FEBRUARY'])

    await runCommand('CHANGE', ['12.50%', '12.50%', '12.50%', 'MARCH'])

    await runCommand('CHANGE', ['--', '8.00%', '-3.00%', '7.00%', 'APRIL'])

    await runCommand('CHANGE', ['13.00%', '21.00%', '10.50%', 'MAY'])

    await runCommand('CHANGE', ['--', '10.00%', '8.00%', '-5.00%', 'JUNE'])

    await runCommand('REBALANCE', [])

    expect(logger.info.args[0][0]).to.be.equal('23619 11809 3936')
  })

  it('should persist operations to rebalance the amount', async () => {
    await runCommand('ALLOCATE', ['6000', '3000', '1000'])

    await runCommand('SIP', ['2000', '1000', '500'])

    await runCommand('CHANGE', ['4.00%', '10.00%', '2.00%', 'JANUARY'])

    await runCommand('CHANGE', ['--', '-10.00%', '40.00%', '0.00%', 'FEBRUARY'])

    await runCommand('CHANGE', ['12.50%', '12.50%', '12.50%', 'MARCH'])

    await runCommand('CHANGE', ['--', '8.00%', '-3.00%', '7.00%', 'APRIL'])

    await runCommand('CHANGE', ['13.00%', '21.00%', '10.50%', 'MAY'])

    await runCommand('CHANGE', ['--', '10.00%', '8.00%', '-5.00%', 'JUNE'])

    await runCommand('BALANCE', ['JUNE'])

    expect(logger.info.getCall(0).args[0]).to.be.equal('21590 13664 4112')

    await runCommand('REBALANCE', [])

    expect(logger.info.getCall(1).args[0]).to.be.equal('23619 11809 3936')

    await runCommand('BALANCE', ['JUNE'])

    expect(logger.info.getCall(2).args[0]).to.be.equal('23619 11809 3936')

    const rebalanceOperations = await db.Operation.findAll({
      where: {
        type: 'rebalance',
      },
      raw: true,
    })

    expect(rebalanceOperations).to.have.lengthOf(3)
  })

  it('should rebalance in June even if more records exist', async () => {
    await runCommand('ALLOCATE', ['6000', '3000', '1000'])

    await runCommand('SIP', ['2000', '1000', '500'])

    await runCommand('CHANGE', ['4.00%', '10.00%', '2.00%', 'JANUARY'])

    await runCommand('CHANGE', ['--', '-10.00%', '40.00%', '0.00%', 'FEBRUARY'])

    await runCommand('CHANGE', ['12.50%', '12.50%', '12.50%', 'MARCH'])

    await runCommand('CHANGE', ['--', '8.00%', '-3.00%', '7.00%', 'APRIL'])

    await runCommand('CHANGE', ['13.00%', '21.00%', '10.50%', 'MAY'])

    await runCommand('CHANGE', ['--', '10.00%', '8.00%', '-5.00%', 'JUNE'])

    await runCommand('CHANGE', ['--', '12.00%', '-7.00%', '17.50%', 'JULY'])

    await runCommand('REBALANCE', [])

    expect(logger.info.calledWith('23619 11809 3936')).to.be.true
  })

  it('should rebalance in December', async () => {
    await runCommand('ALLOCATE', ['6000', '3000', '1000'])

    await runCommand('SIP', ['2000', '1000', '500'])

    await runCommand('CHANGE', ['4.00%', '10.00%', '2.00%', 'JANUARY'])

    await runCommand('CHANGE', ['--', '-10.00%', '40.00%', '0.00%', 'FEBRUARY'])

    await runCommand('CHANGE', ['12.50%', '12.50%', '12.50%', 'MARCH'])

    await runCommand('CHANGE', ['--', '8.00%', '-3.00%', '7.00%', 'APRIL'])

    await runCommand('CHANGE', ['13.00%', '21.00%', '10.50%', 'MAY'])

    await runCommand('CHANGE', ['--', '10.00%', '8.00%', '-5.00%', 'JUNE'])

    await runCommand('REBALANCE', [])

    expect(logger.info.getCall(0).args[0]).to.be.equal('23619 11809 3936')

    await runCommand('CHANGE', ['--', '10.00%', '-5.00%', '2.00%', 'JULY'])

    await runCommand('CHANGE', ['5.50%', '6.00%', '3.00%', 'AUGUST'])

    await runCommand('CHANGE', ['--', '-4.00%', '0.50%', '-4.00%', 'SEPTEMBER'])

    await runCommand('CHANGE', ['7.00%', '10.00%', '20.00%', 'OCTOBER'])

    await runCommand('CHANGE', ['--', '-3.00%', '-8.00%', '-11.00%', 'NOVEMBER'])

    await runCommand('CHANGE', ['15.25%', '11.00%', '10.50%', 'DECEMBER'])

    await runCommand('BALANCE', ['DECEMBER'])

    expect(logger.info.getCall(1).args[0]).to.be.equal('45789 20139 8062')

    await runCommand('REBALANCE', [])

    expect(logger.info.getCall(2).args[0]).to.be.equal('44394 22197 7399')
  })
})
