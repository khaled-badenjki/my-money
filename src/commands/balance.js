const {Command} = require('commander')
const logger = require('../helpers/logger')
const {balanceService} = require('../services')
const {validateBalance} = require('../helpers/validator')
const {
  serializeBalanceInput,
  serializeBalanceOutput,
} = require('../helpers/serializer')

const balance = new Command('BALANCE')
    .description('receives a month name')
    .argument('<month>', 'month')
    .action((month) =>
      handleBalance(month))

const handleBalance = async (month) => {
  try {
    validateBalance(month)

    const serializedMonth = serializeBalanceInput(month)

    const balance = await balanceService.execute(serializedMonth)

    serializeBalanceOutput(balance)

    printBalance(balance)
  } catch (error) {
    logger.error(error.message)
  }
}

const printBalance = (balance) =>
  logger.info(balance.map((b) => b.balance).join(' '))

module.exports = balance
