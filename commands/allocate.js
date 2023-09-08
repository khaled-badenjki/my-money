const { Command } = require('commander')
const logger = require('../logger')
const { accountService } = require('../services')

const _handleAllocate = async (equity, debt, gold) => {
  logger.info(`ALLOCATE EQUITY:${equity}, DEBT:${debt}, GOLD:${gold}`)
  await accountService.setDesiredAllocationPercentage({
    equity,
    debt,
    gold
  })
}

const allocate = new Command('allocate')
  .description('receives the initial investment amounts for each fund.')
  .argument('<equity>', 'equity investment amount')
  .argument('<debt>', 'debt investment amount')
  .argument('<gold>', 'gold investment amount')
  .action(_handleAllocate)

module.exports = allocate
