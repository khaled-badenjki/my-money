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

  const accountAmounts = _appendAccountIds(dbAccounts, accounts)

  await db.Operation.bulkCreate(
    accountAmounts.map(accountAmount => ({
      type: 'allocation',
      amount: accountAmount.amount,
      accountId: accountAmount.accountId,
      date: ALLOCATION_DATE
    }))
  )

  await db.sequelize.close()
}


const _appendAccountIds = (accounts, accountAmounts) => 
  accountAmounts.map(accountAmount => ({
    amount: accountAmount.amount,
    accountId: accounts.find(account => account.name === accountAmount.name).id
  })
)

module.exports = {
  allocate,
  accountService: account,
  operationService: operation
}
