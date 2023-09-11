const calculator = require('../helpers/calculator')
const db = require('../dal/models')

const ALLOCATION_DATE = '2023-01-15'

const allocate = async accounts => {
  const amounts = accounts.map(account => account.amount)
  const percentages = calculator.calculatePercentages(amounts)

  const dbAccounts = await db.Account.bulkCreate(
    accounts.map((account, index) => ({
      name: account.name,
      desiredAllocationPercentage: percentages[index]
    }))
  )

  await db.Operation.bulkCreate(
    accounts.map((account, index) => ({
      type: 'allocation',
      amount: account.amount,
      accountId: dbAccounts[index].id,
      date: ALLOCATION_DATE
    }))
  )
}

const sip = async sipAccounts => {
  const accounts = Promise.all(
    sipAccounts.map(account => db.Account.update(
      { monthlyInvestment: account.sip },
      { where: { name: account.name } }
    ))
  )

  return accounts
}

const change = async (accountsChangePercentage, month) => {
  const sum = await db.Operation.findAll(_buildSumQuery())

  const accounts = await db.Account.findAll({
    raw: true
  })

  const operations
    = _buildOperations(accounts, sum, month, accountsChangePercentage)

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
    const total = sum.find(s => s.accountId === account.id).total
    const change = total * (changeArr[index].change / 100)
    return {
      type: 'change',
      amount: change,
      accountId: account.id,
      date: `2023-${_monthToNumber(month)}-15`
    }
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
  allocate,
  sip,
  change
}
