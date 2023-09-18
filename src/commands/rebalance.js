const {Command} = require('commander')
const logger = require('../helpers/logger')
const rebalanceService = require('../services/rebalance')
const {serializeBalanceOutput} = require('../helpers/serializer')

const rebalance = new Command('REBALANCE')
    .description('receives receives no additional inputs')
    .action(() =>
      handleRebalance())

const handleRebalance = async () => {
  try {
    const rebalance = await rebalanceService.execute()

    serializeBalanceOutput(rebalance)

    printRebalance(rebalance)
  } catch (error) {
    logger.error(error.message)
  }
}

const printRebalance = (rebalance) =>
  logger.info(rebalance.map((r) => r.balance).join(' '))

module.exports = rebalance
