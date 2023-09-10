require('dotenv').config()

const defaultConfig = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  logging: false,
  dialect: 'postgres'
}

module.exports = {
  development: defaultConfig,
  test: defaultConfig,
  production: defaultConfig
}
