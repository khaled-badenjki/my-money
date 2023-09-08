
/**
 * Calculates the percentages of the amounts in the array
 * It returns an array of integers as percentages
 * @example
 * // calculatePercentages([600, 300, 100]) returns [60, 30, 10]
 * @param {Array} amounts - Array of amounts
 * @returns {Array} - Array of percentages
 */
function calculatePercentages(amounts) {
  // Calculate the sum of all amounts
  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0)
  
  // Calculate the percentages as integers and keep track of the remaining
  let remaining = 100
  const percentages = amounts.map(amount => {
    const percentage = Math.floor((amount / totalAmount) * 100)
    remaining -= percentage
    return percentage
  })

  // Add the remaining percentage to the last value
  percentages[percentages.length - 1] += remaining

  // Return the percentages as an array of integers
  return percentages
}

module.exports = {
  calculatePercentages
}
