const db = require('../dal/models')

const createAllocations = () => {
  db.Operation.bulkCreate()
}

module.exports = {
  createAllocations
}
