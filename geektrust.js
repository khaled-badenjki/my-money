const fs = require('fs')
const program = require('./src/commands')
const db = require('./src/dal/models')

const parseFile = async (filePath) => {
  await db.sequelize.sync({force: true})

  const file = fs.readFileSync(filePath, 'utf8')

  const commands = file.split('\n')

  for (const command of commands) {
    const [name, ...args] = command.split(' ')

    const hasNegativeValue = args.some((arg) => arg.includes('-'))

    if (hasNegativeValue) {
      await program.parseAsync(['node', 'index.js', name, '--', ...args])
    } else {
      await program.parseAsync(['node', 'index.js', name, ...args])
    }
  }
}

parseFile(process.argv[2])
