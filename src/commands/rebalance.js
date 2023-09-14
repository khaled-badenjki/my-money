const { Command } = require('commander')
const logger = require('../helpers/logger')
const rebalanceService = require('../services/rebalance')

const rebalance = new Command('REBALANCE')
  .description('receives receives no additional inputs')
  .action(() =>
    _handleRebalance())

const _handleRebalance = async () => {
  try {
    const rebalance = await rebalanceService.execute()
    logger.info(rebalance.map(r => r.amount).join(' '))
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = rebalance
