const program = require('./src/commands')

program.parseAsync(process.argv).catch((err) => {
  console.error(err)
  process.exit(1)
})
