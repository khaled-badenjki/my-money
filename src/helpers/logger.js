const { createLogger, format, transports } = require('winston')

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test' ) {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(info => `${info.message}`)
    )
  }))
}

module.exports = logger
