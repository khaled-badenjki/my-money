const db = require('../dal/models')

const execute = async () => {
  const operations = await db.Operation.findAll({
    where: {
      type: 'allocation'
    }
  })

  if (operations.length < 6) {
    throw new Error('CANNOT_REBALANCE')
  }

  return operations
}

module.exports = {
  execute
}
