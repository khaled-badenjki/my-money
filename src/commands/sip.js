const { Command } = require('commander')
const logger = require('../helpers/logger')
const { validateSip } = require('../helpers/validator')
const { sipService } = require('../services')
const { serializeSip } = require('../helpers/serializer')


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

    const serializedAmounts = serializeSip(amounts)
  
    await sipService.execute(serializedAmounts)
  
  } catch (error) {
  
    logger.error(error.message)
  
  }
}

module.exports = sip
