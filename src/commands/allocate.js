const { Command } = require('commander')
const logger = require('../helpers/logger')
const { validateAllocateInput } = require('../helpers/validator')
const { allocateService } = require('../services')
const calculator = require('../helpers/calculator')
const db = require('../dal/models')

const INPUT_ORDER = [ 'equity', 'debt', 'gold' ]

const allocate = new Command('ALLOCATE')
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
  try {

    validateAllocateInput(allocateInput) 
  
    const accountAmounts = _serializeAllocateInput(allocateInput)

    await allocateService.execute(accountAmounts)
    
  } catch (error) {
    logger.error(error.message)
  }
}

const _serializeAllocateInput = arr => arr.map((amount, index) => ({
  name: INPUT_ORDER[index],
  amount: calculator.floor(amount)
}))

module.exports = allocate
