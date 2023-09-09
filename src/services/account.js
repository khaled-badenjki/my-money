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
  const percentages = calculator.calculatePercentages(amounts)

  return db.Account.bulkCreate(
    Object.keys(accounts).map((type, index) => ({
      name: type,
      desiredAllocationPercentage: percentages[index]
    }))
  )
}

module.exports = {
  setDesiredAllocationPercentage
}
