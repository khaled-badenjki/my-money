const db = require('../dal/models')

/**
 * @param {Object} accounts
 * @param {Object} accounts.equity
 * @param {Number} accounts.equity.id
 * @param {Number} accounts.equity.amount
 * @param {Object} accounts.debt
 * @param {Number} accounts.debt.id
 * @param {Number} accounts.debt.amount
 * @param {Object} accounts.gold
 * @param {Number} accounts.gold.id
 * @param {Number} accounts.gold.amount
 */
const createAllocations = accounts => {
  return db.Operation.bulkCreate(Object.keys(accounts).map(account => ({
    type: 'allocation',
    amount: accounts[account].amount,
    accountId: accounts[account].id,
    date: new Date()
  }))
  )
}

module.exports = {
  createAllocations
}
