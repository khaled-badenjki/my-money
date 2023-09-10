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
 * @param {Object} allocateInput 
 * @param {String} allocateInput.equity
 * @param {String} allocateInput.debt
 * @param {String} allocateInput.gold
 * @returns 
 */
const _handleAllocate = async (allocateInput, command) => {
  if (!_validateAllocateInput(allocateInput)) {
    logError('Invalid input')
    return
  }

  const accountsData = allocateInput.map((amount, index) => ({
    name: INPUT_ORDER[index],
    amount
  }))

  logCommand(command)

  const accounts = await accountService.createManyWithPercentage(accountsData)

  const accountsDataWithId = accounts.map(accountsData => ({
    id: accounts.find(account => account.name === accountsData.name).id,
    name: accountsData.name
  }))

  await operationService.createAllocations(accountsDataWithId)
  await db.sequelize.close()
}

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
