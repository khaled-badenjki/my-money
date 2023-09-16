const {months} = require('../../config')
const db = require('../dal/models')
const balanceService = require('./balance')
const {defaults} = require('../../config')

const execute = async () => {
  const month = await getLatestOperationMonth()

  if (parseInt(month) < parseInt(months.JUNE)) {
    throw new Error('CANNOT_REBALANCE')
  }

  const rebalanceMonth = month === months.DECEMBER ?
    months.DECEMBER : months.JUNE

  const balance = await balanceService.execute(rebalanceMonth)
  const desiredAllocationPercentages = await db.Account.findAll({
    attributes: ['desiredAllocationPercentage', 'name'],
    raw: true,
  })

  const totalBalance = balance.reduce((acc, curr) => acc + curr.balance, 0)

  const rebalanceAmount = balance.map((b, index) => {
    const desiredAllocationPercentage = desiredAllocationPercentages.find(
        (d) => d.name === b.accountName,
    ).desiredAllocationPercentage
    const desiredBalance =
      Math.floor(totalBalance * desiredAllocationPercentage / 100)
    return {
      id: b.accountId,
      name: b.accountName,
      amount: desiredBalance,
      difference: desiredBalance - b.balance,
    }
  })

  db.Operation.bulkCreate(
      rebalanceAmount.map((account) => {
        return {
          type: 'rebalance',
          amount: account.difference,
          accountId: account.id,
          date: `${defaults.YEAR}-${month}-${defaults.DAY}`,
        }
      }),
  )
  return rebalanceAmount
}

const getLatestOperationMonth = async () => {
  const operation = await db.Operation.findOne({
    attributes: [
      [db.sequelize.fn('max', db.sequelize.col('date')), 'latestDate'],
    ],
    raw: true,
  })

  if (!operation.latestDate) {
    throw new Error('CANNOT_REBALANCE')
  }

  return operation.latestDate.split('-')[1]
}

module.exports = {
  execute,
}
