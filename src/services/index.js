const allocate = require('./allocate')
const balance = require('./balance')
const sip = require('./sip')
const change = require('./change')
const rebalance = require('./rebalance')

module.exports = {
  allocateService: allocate,
  balanceService: balance,
  sipService: sip,
  changeService: change,
  rebalanceService: rebalance,
}
