const { expect } = require('chai')
const sinon = require('sinon')
const program = require('../../src/commands')
const db = require('../../src/dal/models')
const logger = require('../../src/helpers/logger')
const { defaults } = require('../../config')

const runCommand = (command, args) => program
    .parseAsync(['node', 'index.js', command, ...args])

describe('SIP e2e', () => {
  it('should update accounts field "monthlyInvestment"', async () => {
    await runCommand('ALLOCATE', ['6000', '3000', '1000'])

    const accounts = await db.Account.findAll({
      where: { monthlyInvestment: { [db.Sequelize.Op.ne]: null } }
    })

    expect(accounts.length).to.be.equal(0)

    await runCommand('SIP', ['2000', '1000', '500'])

    const updatedAccounts = await db.Account.findAll({
      where: { monthlyInvestment: { [db.Sequelize.Op.ne]: null } }
    })

    expect(updatedAccounts.length).to.be.equal(3)
  })
})
