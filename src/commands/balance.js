const { Command } = require('commander')
const { logger } = require('../helpers/logger')
const services = require('../services')

const balance = new Command('BALANCE')
  .description('receives a month name')
  .argument('<month>', 'month')
  .action(month => 
    _handleBalance(month))

const _handleBalance = async month => {
  try {
    const balance = await services.balance(month)
    logger.info(balance.map(b => b.balance).join(' '))
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = balance
