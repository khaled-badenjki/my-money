const {months, defaults} = require('../../config')

const {EQUITY, DEBT, GOLD} = defaults

const BALANCE_ORDER = [EQUITY, DEBT, GOLD]
const CHANGE_ARGUMENTS = [EQUITY, DEBT, GOLD]
const ALLOCATE_ARGUMENTS = [EQUITY, DEBT, GOLD]
const SIP_ARGUMENTS = [EQUITY, DEBT, GOLD]

const _serializeCommon =
  (args) => (amountsArray) => amountsArray.map((amount, index) => ({
    name: args[index],
    amount: Math.floor(amount),
  }),
  )

const _serializeMonth = (month) => months[month.toUpperCase()]

const serializeBalanceInput = _serializeMonth

const serializeBalanceOutput = (balance) => balance.sort((a, b) =>
  BALANCE_ORDER.indexOf(a.name) - BALANCE_ORDER.indexOf(b.name))

const serializeChange = (percentagesArray, month) => {
  const serializedPercentages = _serializeChangePercentage(percentagesArray)
  const serializedMonth = _serializeMonth(month)

  return {
    serializedPercentages,
    serializedMonth,
  }
}

const _serializeChangePercentage = (percentagesArray) =>
  percentagesArray.map((change, index) => ({
    name: CHANGE_ARGUMENTS[index],
    change: Number(change.slice(0, -1)),
  }),
  )

const serializeAllocate = _serializeCommon(ALLOCATE_ARGUMENTS)

const serializeSip = _serializeCommon(SIP_ARGUMENTS)

module.exports = {
  serializeBalanceInput,
  serializeBalanceOutput,
  serializeChange,
  serializeAllocate,
  serializeSip,
}
