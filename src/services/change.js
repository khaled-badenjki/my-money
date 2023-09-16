const {defaults, months} = require('../../config')
const db = require('../dal/models')

const execute = async (accountsChangePercentage, month) => {
  await validatePreviousMonth(month)

  const sum = await db.Operation.findAll(_buildSumQuery())

  const accounts = await db.Account.findAll({
    raw: true,
  })

  const operations = accounts.map((account, index) => {
    let total = _getAccountTotal(sum, account)
    const op = []
    if (_sipIsApplicable(month)) {
      total += account.monthlyInvestment
      op.push(_buildSipOperations(account, month))
    }

    const change =
      _changePercentToAmount(total, accountsChangePercentage[index].percentage)

    op.push(_buildChangeOperations(account, change, month))

    return op
  }).flat()


  await db.Operation.bulkCreate(operations.flat())

  return sum
}

const validatePreviousMonth = async (month) => {
  if (month === months.JANUARY) return

  const previousMonth = `${parseInt(month) - 1}`.padStart(2, '0')

  const operation = await db.Operation.findOne({
    attributes: [
      [db.sequelize.fn('max', db.sequelize.col('date')), 'latestDate'],
    ],
    raw: true,
  })

  const lastMonth = operation.latestDate.split('-')[1]

  if (lastMonth !== previousMonth) {
    throw new Error('PREVIOUS_MONTH_NOT_SET')
  }
}

const _buildSumQuery = () => {
  return {
    attributes: [
      'accountId',
      [db.sequelize.fn('sum', db.sequelize.col('amount')), 'total'],
    ],
    group: ['accountId'],
    raw: true,
  }
}

const _buildChangeOperations = (account, change, month) => {
  return {
    type: 'change',
    amount: Math.floor(change),
    accountId: account.id,
    date: `${defaults.YEAR}-${month}-${defaults.DAY}`,
  }
}

const _buildSipOperations = (account, month) => {
  return {
    type: 'sip',
    amount: account.monthlyInvestment,
    accountId: account.id,
    date: `${defaults.YEAR}-${month}-${defaults.DAY}`,
  }
}

const _sipIsApplicable = (month) =>
  month >= defaults.SIP_START_MONTH

const _getAccountTotal = (sum, account) =>
  parseInt(sum.find((s) => s.accountId === account.id).total)

const _changePercentToAmount = (total, change) =>
  total * (change / 100)

module.exports = {
  execute,
}
