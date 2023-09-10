const validateAllocateInput = arr => {
  return _validateExists(arr) && 
    _validateIsNumber(arr) && 
    _validateIsPositive(arr)
}

const validateSipInput = validateAllocateInput

const validateChangeInput = arr => {
  return _validateExists(arr) && 
    _validateIsPercentage(arr)
}

const _validateExists = arr => {
  return arr.some(amount => !amount) ? false : true
}

const _validateIsNumber = arr => {
  return arr.some(amount => isNaN(amount)) ? false : true
}

const _validateIsPositive = arr => {
  return arr.some(amount => amount < 0) ? false : true
}

const _validateIsPercentage = arr => {
  return arr.some(amount => amount.endsWith('%')) ? true : false
}

module.exports = {
  validateAllocateInput,
  validateSipInput,
  validateChangeInput
}
