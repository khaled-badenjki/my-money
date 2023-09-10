const { Command } = require('commander')
const { logError, logCommand } = require('../helpers/logger')

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
  if (!_validateSipInput(sipInput)) {
    logError('Invalid input')
    return
  }

  logCommand(command)
}

const _validateSipInput = arr => {
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

module.exports = sip
