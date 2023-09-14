const { months } = require('../../config')
const db = require('../dal/models')
const balanceService = require('./balance')

const execute = async () => {
  const operation = await db.Operation.findOne({
    attributes: [
      [db.sequelize.fn('max', db.sequelize.col('date')), 'latestDate']
    ],
    raw: true
  })

  if (!operation.latestDate) {
    throw new Error('CANNOT_REBALANCE')
  }

  const month = operation.latestDate.split('-')[1]

  if (parseInt(month) < parseInt(months.JUNE)) {
    throw new Error('CANNOT_REBALANCE')
  }
  
  if (parseInt(month) < parseInt(months.DECEMBER)) {
    const balance = await balanceService.execute(months.DECEMBER)
    const desiredAllocationPercentages = await db.Account.findAll({
      attributes: ['desiredAllocationPercentage', 'name'],
      raw: true
    })

    const totalBalance = balance.reduce((acc, curr) => acc + curr.balance, 0)

    const rebalanceAmount = balance.map((account, index) => {

      const desiredAllocationPercentage = desiredAllocationPercentages.find(
        d => d.name === account.name
      ).desiredAllocationPercentage
      const desiredBalance = 
        Math.floor(totalBalance * desiredAllocationPercentage / 100)
      return {
        name: account.name,
        amount: desiredBalance
      }
    })

    return rebalanceAmount
  }

  return operation
}

module.exports = {
  execute
}
