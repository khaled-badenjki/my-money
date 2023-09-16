require('dotenv').config()

const defaultConfig = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  logging: false,
  dialect: 'postgres',
  pool: {
    idle: 1,
    evict: 1,
  },
}

module.exports = {
  development: defaultConfig,
  test: {
    ...defaultConfig,
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    pool: {
      idle: 1000,
      evict: 1000,
    },
  },
  production: defaultConfig,
}
