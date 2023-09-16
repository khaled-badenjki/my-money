const calculator = require('../helpers/calculator')
const db = require('../dal/models')
const {errors, defaults, constants} = require('../../config')

const execute = async (accounts) => {
  await validateNonAllocated()

  const percentages = calculateDesiredPercentages(accounts)

  await persistAsTransaction(accounts, percentages)
}

const validateNonAllocated = async () => {
  const existingAllocations = await getExistingAllocations()

  if (existingAllocations.length > 0) throw new Error(errors.ALREADY_ALLOCATED)
}

const calculateDesiredPercentages = (accounts) => {
  const amounts = accounts.map((account) => account.amount)

  return calculator.calculatePercentages(amounts)
}

const persistAsTransaction = async (accounts, percentages) => {
  const t = await db.sequelize.transaction()

  const dbAccounts = await db.Account.bulkCreate(
      _buildAccounts(accounts, percentages), {transaction: t})

  await db.Operation.bulkCreate(
      _buildOperations(accounts, dbAccounts), {transaction: t})

  await t.commit()
}

const _buildAccounts = (accounts, percentages) =>
  accounts.map((account, index) => ({
    name: account.name,
    desiredAllocationPercentage: percentages[index],
  }),
  )

const _buildOperations = (newAccounts, existingAccounts) =>
  newAccounts.map((account, index) => ({
    type: constants.ALLOCATION,
    amount: account.amount,
    accountId: existingAccounts[index].id,
    date: defaults.ALLOCATION_DATE,
  }))

const getExistingAllocations = () => db.Operation.findAll({
  attributes: ['id'],
  where: {type: constants.ALLOCATION},
  raw: true,
})

module.exports = {
  execute,
}
