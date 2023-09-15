const db = require('../dal/models')
const { defaults } = require('../../config')

const BALANCE_ORDER = ['equity', 'debt', 'gold']

const execute = async month => {
  const sum = await db.Operation.findAll(_buildSumQuery(month))
  const accounts = await db.Account.findAll({ raw: true })

  const balance = accounts.map(account => {
    const total = sum.find(s => s.accountId === account.id).total
    return {
      id: account.id,
      name: account.name,
      balance: total
    }
  })

  balance.sort((a, b) => 
    BALANCE_ORDER.indexOf(a.name) - BALANCE_ORDER.indexOf(b.name))

  return balance
}

const _buildSumQuery = (month) => {
  return {
    attributes: [
      'accountId',
      [db.sequelize.fn('sum', db.sequelize.col('amount')), 'total']
    ],
    group: ['accountId'],
    raw: true,
    where: {
      date: {
        [db.Sequelize.Op.lte]: 
          `${defaults.YEAR}-${month}-${defaults.NEXT_DAY}`
      }
    }
  }
}

module.exports = {
  execute
}
