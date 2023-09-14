const db = require('../dal/models')

const execute = async () => {
  const operations = await db.Operation.findAll({
  })

  if (operations.length === 0) {
    throw new Error('CANNOT_REBALANCE')
  }

  return operations
}

module.exports = {
  execute
}
