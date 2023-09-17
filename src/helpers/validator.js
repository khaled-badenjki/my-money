const {errors, months} = require('../../config')

const validateAllocate = (arr) => validateExists(arr) &&
  validateIsNumber(arr) &&
  validateIsPositive(arr)

const validateSip = validateAllocate

const validateChange = (arr, month) => validateExists(arr) &&
  validateIsPercentage(arr) &&
  validateIsNumber(arr.map((el) => el.slice(0, -1))) &&
  validateIsMonth(month)

const validateBalance = (month) => validateIsMonth(month)

const validateExists = (arr) => {
  if (arr.some((el) => ! el)) {
    throw new Error(errors.MISSING_INPUT)
  }
  return true
}

const validateIsNumber = (arr) => {
  if (arr.some((el) => isNaN(el))) {
    throw new Error(errors.INPUT_NOT_NUMBER)
  }
  return true
}

const validateIsPositive = (arr) => {
  if (arr.some((el) => el < 0)) {
    throw new Error(errors.INPUT_NEGATIVE)
  }
  return true
}

const validateIsPercentage = (arr) => {
  if (arr.some((el) => !el.endsWith('%'))) {
    throw new Error(errors.INPUT_NOT_PERCENTAGE)
  }
  return true
}

const validateIsMonth = (month) => {
  if (!months[month.toUpperCase()]) {
    throw new Error(errors.INVALID_MONTH)
  }
  return true
}

module.exports = {
  validateAllocate,
  validateSip,
  validateChange,
  validateBalance,
}
