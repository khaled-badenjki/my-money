const { Command } = require('commander')
const logger = require('../logger')

const allocate = new Command('allocate')
  .description('receives the initial investment amounts for each fund.')
  .action(() => {
    logger.info('ALLOCATE')
  })

module.exports = allocate
