const { defaults } = require('../../config')
const db = require('../dal/models')

const execute = async (accountsChangePercentage, month) => {
  const sum = await db.Operation.findAll(_buildSumQuery())

  const accounts = await db.Account.findAll({
    raw: true
  })

  const operations
    = _buildOperations(accounts, sum, month, accountsChangePercentage).flat()

  await db.Operation.bulkCreate(operations)

  return sum
}

const _buildSumQuery = () => {
  return {
    attributes: [
      'accountId',
      [db.sequelize.fn('sum', db.sequelize.col('amount')), 'total']
    ],
    group: ['accountId'],
    raw: true
  }
}

const _buildOperations = (accoutnsArr, sum, month, changeArr) => 
  accoutnsArr.map((account, index) => {
    let total = parseInt(sum.find(s => s.accountId === account.id).total)
    if (month >= defaults.SIP_START_MONTH) {
      total += account.sip
    }
    const change = total * (changeArr[index].change / 100)
    return [{
      type: 'sip',
      amount: account.sip,
      accountId: account.id,
      date: `${defaults.YEAR}-${month}-${defaults.DAY}`
    }, {
      type: 'change',
      amount: change,
      accountId: account.id,
      date: `${defaults.YEAR}-${month}-${defaults.DAY}`
    }]
})

module.exports = {
  execute
}
