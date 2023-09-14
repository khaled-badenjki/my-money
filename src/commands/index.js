const { Command } = require('commander')
const allocate = require('./allocate')
const sip = require('./sip')
const change = require('./change')
const balance = require('./balance')
const rebalance = require('./rebalance')

const program = new Command()

program
  .version('0.0.1')
  .description('A CLI for investment fund management')

program.addCommand(allocate)
program.addCommand(sip)
program.addCommand(change)
program.addCommand(balance)
program.addCommand(rebalance)

module.exports = program
