require('dotenv').config()

const defaultConfig = {
  dialect: 'sqlite',
  storage: './db.sqlite',
  logging: false,
  pool: {
    idle: 1,
    evict: 1,
  },
}

module.exports = {
  development: defaultConfig,
  test: {
    ...defaultConfig,
    storage: ':memory:',
    pool: {
      idle: 1000,
      evict: 1000,
    },
  },
  production: defaultConfig,
}
