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
}

const sip = async sipAccounts => {
  const accounts = Promise.all(
    sipAccounts.map(account => db.Account.update(
      { monthlyInvestment: account.sip },
      { where: { name: account.name } }
    ))
  )

  return accounts
}

const change = async accountsChangePercentage => {
  const sum = await db.Operation.findAll({
    attributes: [
      'accountId',
      [db.sequelize.fn('sum', db.sequelize.col('amount')), 'total']
    ],
    group: ['accountId'],
    raw: true
  })

  return sum
}


module.exports = {
  allocate,
  sip,
  change
}
