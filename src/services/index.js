const account = require('./account')
const operation = require('./operation')
const calculator = require('../helpers/calculator')
const db = require('../dal/models')

const ALLOCATION_DATE = '2023-01-15'

const allocate = async accounts => {
  const amounts = accounts.map(account => account.amount)
  const percentages = calculator.calculatePercentages(amounts)

  const dbAccounts = await db.Account.bulkCreate(
    accounts.map((account, index) => ({
      name: account.name,
      desiredAllocationPercentage: percentages[index]
    }))
  )

  await db.Operation.bulkCreate(
    accounts.map((account, index) => ({
      type: 'allocation',
      amount: account.amount,
      accountId: dbAccounts[index].id,
      date: ALLOCATION_DATE
    }))
  )

  await db.sequelize.close()
}



module.exports = {
  allocate,
  accountService: account,
  operationService: operation
}
