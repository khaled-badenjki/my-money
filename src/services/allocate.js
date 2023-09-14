const calculator = require('../helpers/calculator')
const db = require('../dal/models')


const ALLOCATION_DATE = '2023-01-15'

const execute = async accounts => {

  await validateNonAllocated()

  const percentages = calculateDesiredPercentages(accounts)

  await persistAsTransaction(accounts, percentages)

}

const validateNonAllocated = async () => {
  const existingAllocations = await db.Operation.findAll({
    attributes: ['id'],
    where: {
      type: 'allocation'
    },
    raw: true
  })

  if (existingAllocations.length > 0) {
    throw new Error('ALREADY_ALLOCATED')
  }
}

const calculateDesiredPercentages = accounts => {
  const amounts = accounts.map(account => account.amount)
  return calculator.calculatePercentages(amounts)
}

const persistAsTransaction = async (accounts, percentages) => {
  const t = await db.sequelize.transaction()

  const dbAccounts = await db.Account.bulkCreate(
    _buildAccounts(accounts, percentages), { transaction: t })

  await db.Operation.bulkCreate(
    _buildOperations(accounts, dbAccounts), { transaction: t })

  await t.commit()
}

const _buildAccounts = (accounts, percentages) => 
  accounts.map((account, index) => ({
    name: account.name,
    desiredAllocationPercentage: percentages[index]
  })
)

const _buildOperations = (accounts, dbAccounts) => 
  accounts.map((account, index) => ({
    type: 'allocation',
    amount: account.amount,
    accountId: dbAccounts[index].id,
    date: ALLOCATION_DATE
}))

module.exports = { 
  execute
}
