const { Command } = require('commander')
const logger = require('../helpers/logger')
const { accountService, operationService } = require('../services')

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
    return
  }

  _logCommand(command)

  accountService.setDesiredAllocationPercentage(allocateInput)
  operationService.createAllocations(allocateInput)
}

const _validateAllocateInput = allocateInput => {
  const { equity, debt, gold } = allocateInput
  if (!equity || !debt || !gold) {
    logger.error('Invalid input')
    return false
  }
  return true
}

const _logCommand = command => 
  logger.info(`called ${command.name()}`)

module.exports = allocate
