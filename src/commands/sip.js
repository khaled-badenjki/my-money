const { Command } = require('commander')
const { logError, logCommand } = require('../helpers/logger')
const { validateSipInput } = require('../helpers/validator')

const sip = new Command('sip')
  .description('receives investment amount on a monthly basis for each fund.')
  .argument('<equity>', 'equity investment amount')
  .argument('<debt>', 'debt investment amount')
  .argument('<gold>', 'gold investment amount')
  .action((equity, debt, gold, options, command) =>
    _handleSip([ equity, debt, gold ], command))


/**
 * Handles the sip command
 * @param {Array} sipInput
 * @param {Object} command
 * @returns void
 */
const _handleSip = async (sipInput, command) => {
  if (! validateSipInput(sipInput)) {
    logError('Invalid input')
    return
  }

  logCommand(command)
}

module.exports = sip
