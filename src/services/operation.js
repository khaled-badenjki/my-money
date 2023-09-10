const db = require('../dal/models')

const ALLOCATION_DATE = '2023-01-15'

/**
 * @param {Array} accounts array of objects
 * with "name" and "amount" properties
 * @returns {Promise} - Promise object represents the operations
 * 
 */
const createAllocations = accounts => {
  return db.Operation.bulkCreate(
    accounts.map(account => ({
      type: 'allocation',
      amount: account.amount,
      accountId: account.accountId,
      date: ALLOCATION_DATE
    }))
  )
}

module.exports = {
  createAllocations
}
