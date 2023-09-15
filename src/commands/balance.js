const { Command } = require('commander')
const logger = require('../helpers/logger')
const { balanceService } = require('../services')
const { validateBalance } = require('../helpers/validator')
const { months } = require('../../config')

const BALANCE_ARGUMENTS = ['equity', 'debt', 'gold']

const balance = new Command('BALANCE')
  .description('receives a month name')
  .argument('<month>', 'month')
  .action(month => 
    _handleBalance(month))

const _handleBalance = async month => {
  try {
    validateBalance(month)

    const monthNumber = months[month.toUpperCase()]

    const balance = await balanceService.execute(monthNumber)

    balance.sort((a, b) => 
      BALANCE_ARGUMENTS.indexOf(a.name) - BALANCE_ARGUMENTS.indexOf(b.name))
      
    logger.info(balance.map(b => b.balance).join(' '))
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = balance
