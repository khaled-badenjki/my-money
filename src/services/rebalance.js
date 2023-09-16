const {months} = require('../../config')
const db = require('../dal/models')
const balanceService = require('./balance')
const {defaults} = require('../../config')

const execute = async () => {
  const month = await getLatestOperationMonth()

  const rebalanceMonth = decideRebalanceMonthOrFail(month)

  const balance = await balanceService.execute(rebalanceMonth)

  const operations = buildRebalanceOperations(balance, rebalanceMonth)

  await db.Operation.bulkCreate(operations)

  return balanceService.execute(rebalanceMonth)
}

const buildRebalanceOperations = (balance, rebalanceMonth) => {
  const totalBalance = balance.reduce((acc, curr) => acc + curr.balance, 0)

  return balance.map((b, index) => {
    const desiredBalance =
      Math.floor(totalBalance * b.desiredAllocationPercentage / 100)

    return {
      type: 'rebalance',
      accountId: b.id,
      amount: calculateRebalanceAmount(b.balance, desiredBalance),
      date: `${defaults.YEAR}-${rebalanceMonth}-${defaults.DAY}`,
    }
  })
}

const calculateRebalanceAmount = (actualBalance, desiredBalance) =>
  desiredBalance - actualBalance

const decideRebalanceMonthOrFail = (month) => {
  if (parseInt(month) < parseInt(months.JUNE)) {
    throw new Error('CANNOT_REBALANCE')
  }

  return parseInt(month) === parseInt(months.DECEMBER) ?
    months.DECEMBER : months.JUNE
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

  return new Date(operation.latestDate).getMonth() + 1
}

module.exports = {
  execute,
}
