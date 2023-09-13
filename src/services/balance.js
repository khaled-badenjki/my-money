const db = require('../dal/models')

const execute = async month => {
  const sum = await db.Operation.findAll(_buildSumQuery(month))
  const accounts = await db.Account.findAll({ raw: true })

  const balance = accounts.map(account => {
    const total = sum.find(s => s.accountId === account.id).total
    return {
      name: account.name,
      balance: total
    }
  })

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
        [db.Sequelize.Op.lte]: `2023-${month}-16`
      }
    }
  }
}

module.exports = {
  execute
}
