const { Command } = require('commander')
const { logError, logCommand } = require('../helpers/logger')
const { validateChangeInput } = require('../helpers/validator')
const services= require('../services')
const calculator = require('../helpers/calculator')
const db = require('../dal/models')

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
  if (! validateChangeInput(changeInput)) {
    logError('Invalid input')
    return
  }

  logCommand(command)

  const accountChanges = _serializeChangeInput(changeInput)

  await services.change(accountChanges, month)
}

const _serializeChangeInput = arr => arr.map((change, index) => ({
  name: INPUT_ORDER[index],
  change: Number(change.slice(0, -1))
}))

module.exports = change
