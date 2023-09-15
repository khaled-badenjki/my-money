const { Command } = require('commander')
const logger = require('../helpers/logger')
const { balanceService } = require('../services')
const { validateBalance } = require('../helpers/validator')
const { months } = require('../../config')

const balance = new Command('BALANCE')
  .description('receives a month name')
  .argument('<month>', 'month')
  .action(month => 
    _handleBalance(month))

const _handleBalance = async month => {
  try {

    validateBalance(month)

    const serializedMonth = _serializeBalance(month)

    const balance = await balanceService.execute(serializedMonth)
      
    _printBalance(balance)

  } catch (error) {

    logger.error(error.message)

  }
}

const _serializeBalance = month => months[month.toUpperCase()]

const _printBalance = balance => 
  logger.info(balance.map(b => b.balance).join(' '))

module.exports = balance
