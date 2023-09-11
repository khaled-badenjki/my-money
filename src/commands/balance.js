const { Command } = require('commander')
const services = require('../services')

const balance = new Command('BALANCE')
  .description('receives a month name')
  .argument('<month>', 'month')
  .action(month => 
    _handleBalance(month))

const _handleBalance = async month => {
  await services.balance(month)
}

module.exports = balance
