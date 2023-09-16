const db = require('../dal/models')
const {defaults} = require('../../config')

const execute = async (month) => {
  const date = buildDefaultDate(month)

  const balances = await queryBalanceGroupedByAccount(date)

  return balances
}

const queryBalanceGroupedByAccount = async (date) => db.Operation.findAll({
  attributes: [
    'accountId',
    [db.sequelize.fn('sum', db.sequelize.col('amount')), 'balance'],
    [db.sequelize.literal('account.name'), 'accountName'],
  ],
  include: [{
    model: db.Account,
    attributes: [],
    as: 'account',
  }],
  group: ['accountId', 'account.name'],
  raw: true,
  where: {
    date: {
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
