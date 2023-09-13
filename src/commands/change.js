const { Command } = require('commander')
const { logError, logCommand } = require('../helpers/logger')
const { validateChangeInput } = require('../helpers/validator')
const { changeService }  = require('../services')
const { months } = require('../../config')

const INPUT_ORDER = [ 'equity', 'debt', 'gold' ]

const change = new Command('CHANGE')
  .description('receives the monthly rate of change (growth or loss) ' +
    'for each fund type. A negative value represents a loss.')
  .argument('<equity>', 'equity change percentage')
  .argument('<debt>', 'debt change percentage')
  .argument('<gold>', 'gold change percentage')
  .argument('<month>', 'month')
  .action((equity, debt, gold, month, options, command) =>
    _handleChange([ equity, debt, gold ], month, command))


/**
 * Handles the change command
 * @param {Array} changeInput
 * @param {Object} command
 * @returns void
 */
const _handleChange = async (changeInput, month, command) => {
  try {
    validateChangeInput(changeInput, month) 
  
    logCommand(command)
  
    const accountChanges = _serializeChangeInput(changeInput)
    const monthNumber = months[month.toUpperCase()]
  
    await changeService.execute(accountChanges, monthNumber)
  } catch (error) {
    logError(error.message)
  }

}

const _serializeChangeInput = arr => arr.map((change, index) => ({
  name: INPUT_ORDER[index],
  change: Number(change.slice(0, -1))
}))

module.exports = change
