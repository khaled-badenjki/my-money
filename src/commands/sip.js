const { Command } = require('commander')
const logger = require('../helpers/logger')
const { validateSip } = require('../helpers/validator')
const { sipService } = require('../services')
const calculator = require('../helpers/calculator')

const SIP_ARGUMENTS = [ 'equity', 'debt', 'gold' ]

const sip = new Command('SIP')
  .description('receives investment amount on a monthly basis for each fund.')
  .argument('<equity>', 'equity investment amount')
  .argument('<debt>', 'debt investment amount')
  .argument('<gold>', 'gold investment amount')
  .action((equity, debt, gold, options, command) =>
    _handleSip([ equity, debt, gold ], command))


const _handleSip = async (amounts, command) => {
  try {
    
    validateSip(amounts)

    const serializedAmounts = _serializeSipInput(amounts)
  
    await sipService.execute(serializedAmounts)
  
  } catch (error) {
  
    logger.error(error.message)
  
  }

}

const _serializeSipInput = arr => arr.map((sip, index) => ({
  name: SIP_ARGUMENTS[index],
  sip: Math.floor(sip)
}))

module.exports = sip
