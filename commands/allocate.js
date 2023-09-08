const { Command } = require('commander')

const allocate = new Command('allocate')
  .description('The ALLOCATE command receives the initial investment amounts for each fund.')
  .action(() => {
    console.log('ALLOCATE')
  })

  module.exports = allocate
