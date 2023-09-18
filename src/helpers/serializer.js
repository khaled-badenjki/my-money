const {months, defaults} = require('../../config')

const {EQUITY, DEBT, GOLD} = defaults

const BALANCE_ORDER = [EQUITY, DEBT, GOLD]
const CHANGE_ARGUMENTS = [EQUITY, DEBT, GOLD]
const ALLOCATE_ARGUMENTS = [EQUITY, DEBT, GOLD]
const SIP_ARGUMENTS = [EQUITY, DEBT, GOLD]

const serializeCommon =
  (args) => (amountsArray) => amountsArray.map((amount, index) => ({
    name: args[index],
    amount: Math.floor(amount),
  }),
  )

const serializeMonth = (month) => months[month.toUpperCase()]

const serializeBalanceInput = serializeMonth

const serializeBalanceOutput = (balance) => balance.sort((a, b) =>
  BALANCE_ORDER.indexOf(a.name) - BALANCE_ORDER.indexOf(b.name))

const serializeRebalanceOutput = serializeBalanceOutput

const serializeChange = (percentagesArray, month) => {
  const serializedPercentages = serializeChangePercentage(percentagesArray)
  const serializedMonth = serializeMonth(month)

  return {
    serializedPercentages,
    serializedMonth,
  }
}

const serializeChangePercentage = (percentagesArray) =>
  percentagesArray.map((percentage, index) => ({
    name: CHANGE_ARGUMENTS[index],
    percentage: Number(percentage.slice(0, -1)),
  }),
  )

const serializeAllocate = serializeCommon(ALLOCATE_ARGUMENTS)

const serializeSip = serializeCommon(SIP_ARGUMENTS)

module.exports = {
  serializeBalanceInput,
  serializeBalanceOutput,
  serializeChange,
  serializeAllocate,
  serializeSip,
  serializeRebalanceOutput,
}
