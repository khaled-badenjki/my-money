const { Command } = require('commander')
const logger = require('../helpers/logger')
const { validateChange } = require('../helpers/validator')
const { changeService }  = require('../services')
const { months } = require('../../config')

const CHANGE_ARGUMENTS = [ 'equity', 'debt', 'gold' ]

const change = new Command('CHANGE')
  .description('receives the monthly rate of change (growth or loss) ' +
    'for each fund type. A negative value represents a loss.')
  .argument('<equity>', 'equity change percentage')
  .argument('<debt>', 'debt change percentage')
  .argument('<gold>', 'gold change percentage')
  .argument('<month>', 'month')
  .action((equity, debt, gold, month, options, command) =>
    _handleChange([ equity, debt, gold ], month, command))


const _handleChange = async (percentages, month, command) => {
  try {

    validateChange(percentages, month) 
  
    const { 
      serializedPercentages, 
      serializedMonth 
    } = _serializeChange(percentages, month)

    await changeService.execute(serializedPercentages, serializedMonth)

  } catch (error) {

    logger.error(error.message)
    
  }

}

const _serializeChange = (percentagesArray, month) => {
  const serializedPercentages = percentagesArray.map((change, index) => ({
    name: CHANGE_ARGUMENTS[index],
    change: Number(change.slice(0, -1))
  }))

  return {
    serializedPercentages,
    serializedMonth: months[month.toUpperCase()]
  }
}
  

module.exports = change
