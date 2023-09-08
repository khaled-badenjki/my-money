const { Command } = require('commander')
const logger = require('../logger')

const allocate = new Command('allocate')
  .description('receives the initial investment amounts for each fund.')
  .argument('<equity>', 'equity investment amount')
  .argument('<debt>', 'debt investment amount')
  .argument('<gold>', 'gold investment amount')
  .action((equity, debt, gold) => {
    logger.info(`ALLOCATE EQUITY:${equity}, DEBT:${debt}, GOLD:${gold}`)
  })

module.exports = allocate
