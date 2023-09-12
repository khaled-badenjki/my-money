const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june', 
  'july','august', 'september', 'october', 'november', 'december']

const validateAllocateInput = arr => _validateExists(arr) 
  && _validateIsNumber(arr) 
  && _validateIsPositive(arr)

const validateSipInput = validateAllocateInput

const validateChangeInput = (arr, month) => _validateExists(arr) 
  && _validateIsPercentage(arr)
  && _validateIsNumber(arr.map(amount => amount.slice(0, -1)))
  && _validateIsMonth(month)

const _validateExists = arr => {
  if (arr.some(amount => ! amount)) throw new Error('MISSING_INPUT')
  return true
}

const _validateIsNumber = arr => {
  if (arr.some(amount => isNaN(amount))) throw new Error('INPUT_NOT_NUMBER')
  return true
}

const _validateIsPositive = arr => {
  if (arr.some(amount => amount < 0)) throw new Error('INPUT_NEGATIVE')
  return true
}

const _validateIsPercentage = arr => {
  if (arr.some(el => !el.endsWith('%'))) throw new Error('INPUT_NOT_PERCENTAGE')
  return true
}

const _validateIsMonth = month => {
  if (! MONTHS.includes(month.toLowerCase())) throw new Error('INVALID_MONTH')
  return true
}

module.exports = {
  validateAllocateInput,
  validateSipInput,
  validateChangeInput
}
