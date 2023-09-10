const validateAllocateInput = arr => _validateExists(arr) 
  && _validateIsNumber(arr) 
  && _validateIsPositive(arr)

const validateSipInput = validateAllocateInput

const validateChangeInput = arr => _validateExists(arr) 
  && _validateIsPercentage(arr)
  && _validateIsInRange(arr.map(amount => amount.slice(0, -1)))

const _validateExists = arr => arr.some(amount => !amount) ? false : true

const _validateIsNumber = arr => arr.some(amount => isNaN(amount)) 
  ? false : true

const _validateIsPositive = arr => arr.some(amount => amount < 0) ? false : true

const _validateIsPercentage = arr => arr.some(amount => amount.endsWith('%')) 
  ? true : false

const _validateIsInRange = arr => arr.some(
  amount => amount > 100 || amount < -100
  ) ? false : true

module.exports = {
  validateAllocateInput,
  validateSipInput,
  validateChangeInput
}
