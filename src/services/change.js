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
    if (month === 'FEBRUARY') {
      total += account.sip
    }
    const change = total * (changeArr[index].change / 100)
    return [{
      type: 'sip',
      amount: account.sip,
      accountId: account.id,
      date: `2023-${_monthToNumber(month)}-15`
    }, {
      type: 'change',
      amount: change,
      accountId: account.id,
      date: `2023-${_monthToNumber(month)}-15`
    }]
})

const _monthToNumber = month => {
  const months = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12'
  }

  if (! months[month.toLowerCase()]) {
    throw new Error('Invalid month')
  }

  return months[month.toLowerCase()]
}

module.exports = {
  execute
}
