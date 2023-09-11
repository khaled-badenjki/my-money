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

  const dbAccounts = await db.Account.bulkCreate(
    accounts.map((account, index) => ({
      name: account.name,
      desiredAllocationPercentage: percentages[index]
    }))
  )

  await db.sequelize.close()

  return dbAccounts
}

const setSip = async (accuontSip) => {
  return Promise.all(
    accuontSip.map(account => db.Account.update(
      { monthlyInvestment: account.sip },
      { where: { name: account.name } }
    ))
  )
}

module.exports = {
  createManyWithPercentage,
  setSip
}
