const calculator = require('../helpers/calculator')
const db = require('../dal/models')

/**
 * @param {object} accounts - accounts object where key is the 
 * type and value is the amount
 * @returns {void}
 * @description sets the desired allocation percentage for each
 * account type
 */
const setDesiredAllocationPercentage = accounts => {
  const amounts = Object.values(accounts)
  calculator.calculatePercentages(amounts)

  db.Account.bulkCreate(amounts)
}

module.exports = {
  setDesiredAllocationPercentage
}
