
/**
 * Calculates the percentages of the amounts in the array
 * It returns an array of integers as percentages
 * @example
 * // calculatePercentages([600, 300, 100]) returns [60, 30, 10]
 * @param {Array} amounts - Array of amounts
 * @returns {Array} - Array of percentages
 */
const calculatePercentages = amounts => {
  const sum = amounts.reduce((sum, amount) => sum + amount, 0)
  
  const percentages = amounts.map(
    amount => _convertFloatToPercentage(amount / sum)
  )

  return _normalizePercentages(percentages)
}

const _normalizePercentages = percentages => {
  const sum = percentages.reduce((sum, amount) => sum + amount, 0)

  return sum === 100 ? percentages 
    : [percentages.slice(0, -1), percentages.slice(-1)[0] + (100 - sum)].flat()
}

const _convertFloatToPercentage = float => Math.floor(float * 100)

module.exports = {
  calculatePercentages
}
