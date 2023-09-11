const account = require('./account')
const operation = require('./operation')
const calculator = require('../helpers/calculator')
const db = require('../dal/models')

const allocate = async accounts => {
  const amounts = accounts.map(account => account.amount)
  const percentages = calculator.calculatePercentages(amounts)

  const dbAccounts = await db.Account.bulkCreate(
    accounts.map((account, index) => ({
      name: account.name,
      desiredAllocationPercentage: percentages[index]
    }))
  )

  await db.sequelize.close()

  return dbAccounts
}

module.exports = {
  allocate,
  accountService: account,
  operationService: operation
}
