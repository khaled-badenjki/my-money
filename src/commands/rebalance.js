const {Command} = require('commander')
const logger = require('../helpers/logger')
const rebalanceService = require('../services/rebalance')

const rebalance = new Command('REBALANCE')
    .description('receives receives no additional inputs')
    .action(() =>
      _handleRebalance())

const _handleRebalance = async () => {
  try {
    const rebalance = await rebalanceService.execute()

    _printRebalance(rebalance)
  } catch (error) {
    logger.error(error.message)
  }
}

const _printRebalance = (rebalance) =>
  logger.info(rebalance.map((r) => r.balance).join(' '))

module.exports = rebalance
