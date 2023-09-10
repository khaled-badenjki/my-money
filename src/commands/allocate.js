const { Command } = require('commander')
const { logger, logCommand } = require('../helpers/logger')
const { accountService, operationService } = require('../services')
const db = require('../dal/models')

const allocate = new Command('allocate')
  .description('receives the initial investment amounts for each fund.')
  .argument('<equity>', 'equity investment amount')
  .argument('<debt>', 'debt investment amount')
  .argument('<gold>', 'gold investment amount')
  .action((equity, debt, gold, options, command) =>
    _handleAllocate({ equity, debt, gold }, command))


/**
 * @param {Object} allocateInput 
 * @param {String} allocateInput.equity
 * @param {String} allocateInput.debt
 * @param {String} allocateInput.gold
 * @returns 
 */
const _handleAllocate = async (allocateInput, command) => {
  if (!_validateAllocateInput(allocateInput)) {
    logger.error('Invalid input')
    return
  }

  logCommand(command)

  const accounts = await accountService
    .setDesiredAllocationPercentage(allocateInput)

  const x = {
    equity: {
      id: accounts.find(account => account.name === 'equity').id,
      amount: allocateInput.equity
    },
    debt: {
      id: accounts.find(account => account.name === 'debt').id,
      amount: allocateInput.debt
    },
    gold: {
      id: accounts.find(account => account.name === 'gold').id,
      amount: allocateInput.gold
    }
  }
  await operationService.createAllocations(x)
  await db.sequelize.close()
}

const _validateAllocateInput = allocateInput => {
  const exists = _validateExists(allocateInput)
  const isNumber = _validateIsNumber(allocateInput)
  const isPositive = _validateIsPositive(allocateInput)
  return exists && isNumber && isPositive
}

const _validateExists = allocateInput => {
  const { equity, debt, gold } = allocateInput
  if (!equity || !debt || !gold) {
    return false
  }
  return true
}

const _validateIsNumber = allocateInput => {
  const { equity, debt, gold } = allocateInput
  if (isNaN(equity) || isNaN(debt) || isNaN(gold)) {
    return false
  }
  return true
}

const _validateIsPositive = allocateInput => {
  const { equity, debt, gold } = allocateInput
  if (equity < 0 || debt < 0 || gold < 0) {
    return false
  }
  return true
}

module.exports = allocate
