const {defaults, months, errors, constants} = require('../../config')
const db = require('../dal/models')

const execute = async (accountsAndPercentage, month) => {
  await validatePreviousMonth(month)

  const accountsBalance = await queryAccountWithBalance()

  validateExistence(accountsBalance)

  if (shouldApplySip(month)) applySip(accountsBalance)

  calculateAmountAndAppend(accountsBalance, accountsAndPercentage)

  const operations = prepareOperations(accountsBalance, month)

  await db.Operation.bulkCreate(operations)
}

const validateExistence = (accounts) => {
  if (!accounts.length) {
    throw new Error(errors.NO_ACCOUNTS_FOUND)
  }
}

const prepareOperations = (accountsBalance, month) => {
  const operations = []
  accountsBalance.forEach((account) => {
    operations.push(buildChangeOperations(account, month))
  })

  if (shouldApplySip(month)) {
    accountsBalance.forEach((account) => {
      operations.push(buildSipOperations(account, month))
    })
  }
  return operations
}

const applySip = (accounts) => {
  accounts.forEach((account) => {
    account.balance = parseInt(account.balance) + account.monthlyInvestment
  })
}

const calculateAmountAndAppend = (acounts, accountsAndPercentage) => {
  acounts.forEach((account) => {
    const matchedAccount = accountsAndPercentage.find((aap) =>
      aap.name === account.name)

    account.percentage = matchedAccount.percentage
    account.amount = percentToAmount(account.balance, matchedAccount.percentage)
  })
}

const validatePreviousMonth = async (month) => {
  if (month === months.JANUARY) return

  const previousMonth = `${parseInt(month) - 1}`.padStart(2, '0')

  const operation = await getLatestOperation()

  const lastExistingMonth = new Date(operation.latestDate).getMonth() + 1

  if (lastExistingMonth !== parseInt(previousMonth)) {
    throw new Error(errors.PREVIOUS_MONTH_NOT_SET)
  }
}

const getLatestOperation = () => db.Operation.findOne({
  attributes: [
    [db.sequelize.fn('max', db.sequelize.col('date')), 'latestDate'],
  ],
  raw: true,
})

const queryAccountWithBalance = () => db.Account.findAll({
  attributes: [
    'id',
    'name',
    'monthlyInvestment',
    [db.sequelize.fn('sum', db.sequelize.col('amount')), 'balance'],
  ],
  include: [{
    model: db.Operation,
    attributes: [],
    as: 'operations',
  }],
  raw: true,
  group: ['Account.id'],
})

const buildChangeOperations = (account, month) => {
  return {
    type: constants.CHANGE,
    amount: Math.floor(account.amount),
    accountId: account.id,
    date: `${defaults.YEAR}-${month}-${defaults.DAY}`,
  }
}

const buildSipOperations = (account, month) => {
  return {
    type: constants.SIP,
    amount: account.monthlyInvestment,
    accountId: account.id,
    date: `${defaults.YEAR}-${month}-${defaults.DAY}`,
  }
}

const shouldApplySip = (month) =>
  month >= defaults.SIP_START_MONTH

const percentToAmount = (total, percentage) =>
  total * (percentage / 100)

module.exports = {
  execute,
}
