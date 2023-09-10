const { Command } = require('commander')
const { logError, logCommand } = require('../helpers/logger')
const { accountService, operationService } = require('../services')
const db = require('../dal/models')

const INPUT_ORDER = [ 'equity', 'debt', 'gold' ]

const allocate = new Command('allocate')
  .description('receives the initial investment amounts for each fund.')
  .argument('<equity>', 'equity investment amount')
  .argument('<debt>', 'debt investment amount')
  .argument('<gold>', 'gold investment amount')
  .action((equity, debt, gold, options, command) =>
    _handleAllocate([ equity, debt, gold ], command))


/**
 * Handles the allocate command
 * @param {Array} allocateInput
 * @param {Object} command
 * @returns void
 */
const _handleAllocate = async (allocateInput, command) => {
  if (!_validateAllocateInput(allocateInput)) {
    logError('Invalid input')
    return
  }

  logCommand(command)

  const accountAmounts = _serializeAllocateInput(allocateInput)

  const accounts = await accountService.createManyWithPercentage(accountAmounts)

  const accountOperations = _appendAccountIds(accounts, accountAmounts)

  await operationService.createAllocations(accountOperations)

  await db.sequelize.close()
}

const _appendAccountIds = (accounts, accountAmounts) => 
  accountAmounts.map(accountAmount => ({
    amount: accountAmount.amount,
    accountId: accounts.find(account => account.name === accountAmount.name).id
  })
)

const _serializeAllocateInput = arr => arr.map((amount, index) => ({
  name: INPUT_ORDER[index],
  amount
}))


const _validateAllocateInput = arr => {
  return _validateExists(arr) && 
    _validateIsNumber(arr) && 
    _validateIsPositive(arr)
}

const _validateExists = arr => {
  return arr.some(amount => !amount) ? false : true
}

const _validateIsNumber = arr => {
  return arr.some(amount => isNaN(amount)) ? false : true
}

const _validateIsPositive = arr => {
  return arr.some(amount => amount < 0) ? false : true
}

module.exports = allocate
