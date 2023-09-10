const calculator = require('../helpers/calculator')
const db = require('../dal/models')

/**
 * @param {Array} accounts - accounts array of objects
 * with "name" and "amount" properties
 * @returns {Promise} - Promise object represents the accounts
 * @description sets the desired allocation percentage for each
 * account type
 */
const createManyWithPercentage = async accounts => {
  const amounts = accounts.map(account => account.amount)
  const percentages = calculator.calculatePercentages(amounts)

  return db.Account.bulkCreate(
    accounts.map((account, index) => ({
      name: account.name,
      desiredAllocationPercentage: percentages[index]
    }))
  )
}

const setSip = async () => {

}

module.exports = {
  createManyWithPercentage,
  setSip
}
