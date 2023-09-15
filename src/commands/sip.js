const { Command } = require('commander')
const logger = require('../helpers/logger')
const { validateSip } = require('../helpers/validator')
const { sipService } = require('../services')
const calculator = require('../helpers/calculator')
const db = require('../dal/models')

const INPUT_ORDER = [ 'equity', 'debt', 'gold' ]

const sip = new Command('SIP')
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
  try {
    validateSip(sipInput)

    const accountSips = _serializeSipInput(sipInput)
  
    await sipService.execute(accountSips)
  } catch (error) {
    logger.error(error.message)
  }

}

const _serializeSipInput = arr => arr.map((sip, index) => ({
  name: INPUT_ORDER[index],
  sip: calculator.floor(sip)
}))

module.exports = sip
