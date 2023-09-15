const { errors, months } = require('../../config')
  
const validateAllocate = arr => _validateExists(arr) 
  && _validateIsNumber(arr) 
  && _validateIsPositive(arr)

const validateSip = validateAllocate

const validateChange = (arr, month) => _validateExists(arr) 
  && _validateIsPercentage(arr)
  && _validateIsNumber(arr.map(el => el.slice(0, -1)))
  && _validateIsMonth(month)

const _validateExists = arr => {
  if (arr.some(el => ! el)) 
    throw new Error(errors.MISSING_INPUT)
  return true
}

const _validateIsNumber = arr => {
  if (arr.some(el => isNaN(el))) 
    throw new Error(errors.INPUT_NOT_NUMBER)
  return true
}

const _validateIsPositive = arr => {
  if (arr.some(el => el < 0)) 
    throw new Error(errors.INPUT_NEGATIVE)
  return true
}

const _validateIsPercentage = arr => {
  if (arr.some(el => !el.endsWith('%'))) 
    throw new Error(errors.INPUT_NOT_PERCENTAGE)
  return true
}

const _validateIsMonth = month => {
  if (!months[month.toUpperCase()]) 
    throw new Error(errors.INVALID_MONTH)
  return true
}

module.exports = {
  validateAllocate,
  validateSip,
  validateChange
}
