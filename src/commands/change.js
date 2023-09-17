const {Command} = require('commander')
const logger = require('../helpers/logger')
const {serializeChange} = require('../helpers/serializer')
const {validateChange} = require('../helpers/validator')
const {changeService} = require('../services')


const change = new Command('CHANGE')
    .description('receives the monthly rate of change (growth or loss) ' +
    'for each fund type. A negative value represents a loss.')
    .argument('<equity>', 'equity change percentage')
    .argument('<debt>', 'debt change percentage')
    .argument('<gold>', 'gold change percentage')
    .argument('<month>', 'month')
    .action((equity, debt, gold, month, options, command) =>
      handleChange([equity, debt, gold], month, command))


const handleChange = async (percentages, month, command) => {
  try {
    validateChange(percentages, month)

    const {
      serializedPercentages,
      serializedMonth,
    } = serializeChange(percentages, month)

    await changeService.execute(serializedPercentages, serializedMonth)
  } catch (error) {
    logger.error(error.message)
  }
}


module.exports = change
