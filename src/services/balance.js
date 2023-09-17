const db = require('../dal/models')
const {defaults, errors} = require('../../config')

const execute = async (month) => {
  const date = buildDefaultDate(month)

  const accountsWithBalance = await queryAccountsBalances(date)

  validateExistence(accountsWithBalance)

  return accountsWithBalance
}

const validateExistence = (accountsWithBalance) => {
  if (!accountsWithBalance.length) throw new Error(errors.NO_ACCOUNTS_FOUND)
}

const queryAccountsBalances = async (date) => db.Account.findAll({
  attributes: [
    'id',
    'name',
    'monthlyInvestment',
    'desiredAllocationPercentage',
    [db.sequelize.fn('sum', db.sequelize.col('amount')), 'balance'],
  ],
  include: [{
    model: db.Operation,
    attributes: [],
    as: 'operations',
  }],
  raw: true,
  group: ['Account.id'],
  where: {
    '$operations.date$': {
      [db.Sequelize.Op.lte]: date,
    },
  },
})

const buildDefaultDate = (month) => {
  return `${defaults.YEAR}-${month}-${defaults.NEXT_DAY}`
}

module.exports = {
  execute,
}
