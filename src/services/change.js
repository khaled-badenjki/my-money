const { defaults } = require('../../config')
const db = require('../dal/models')

const execute = async (accountsChangePercentage, month) => {
  const sum = await db.Operation.findAll(_buildSumQuery())

  const accounts = await db.Account.findAll({
    raw: true
  })

  const operations = accounts.map((account, index) => {
    let total = _getAccountTotal(sum, account)

    if (_sipIsApplicable(month)) total += account.sip

    const change = 
      _changePercentToAmount(total, accountsChangePercentage[index].change)

    return _buildOperations(account, change, month)
  })


  await db.Operation.bulkCreate(operations.flat())

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

const _buildOperations = (account, change, month) => 
  [{
    type: 'sip',
    amount: account.sip,
    accountId: account.id,
    date: `${defaults.YEAR}-${month}-${defaults.DAY}`
  }, {
    type: 'change',
    amount: change,
    accountId: account.id,
    date: `${defaults.YEAR}-${month}-${defaults.DAY}`
  }].flat()

const _sipIsApplicable = month => 
  month >= defaults.SIP_START_MONTH

const _getAccountTotal = (sum, account) =>
  parseInt(sum.find(s => s.accountId === account.id).total)

const _changePercentToAmount = (total, change) =>
  total * (change / 100)

module.exports = {
  execute
}
