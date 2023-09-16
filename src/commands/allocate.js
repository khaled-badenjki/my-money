const {Command} = require('commander')
const logger = require('../helpers/logger')
const {serializeAllocate} = require('../helpers/serializer')
const {validateAllocate} = require('../helpers/validator')
const {allocateService} = require('../services')

const allocate = new Command('ALLOCATE')
    .description('receives the initial investment amounts for each fund.')
    .argument('<equity>', 'equity investment amount')
    .argument('<debt>', 'debt investment amount')
    .argument('<gold>', 'gold investment amount')
    .action((equity, debt, gold, options, command) =>
      _handleAllocate([equity, debt, gold], command))

const _handleAllocate = async (amounts, command) => {
  try {
    validateAllocate(amounts)

    const serializedAmounts = serializeAllocate(amounts)

    await allocateService.execute(serializedAmounts)
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = allocate
