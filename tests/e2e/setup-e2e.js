const db = require('../../src/dal/models')

beforeEach(async () => {
  await db.sequelize.sync({force: true})
})

after(async () => {
  await db.sequelize.close()
})
