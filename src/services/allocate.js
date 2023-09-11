const calculator = require('../helpers/calculator')
const db = require('../dal/models')

const ALLOCATION_DATE = '2023-01-15'


const execute = async accounts => {
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
}

module.exports = { 
  execute
}
