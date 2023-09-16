const db = require('../dal/models')
const {errors} = require('../../config')

const execute = async (sipAccounts) => {
  const accounts = await db.Account.findAll()

  validateExistence(accounts)

  validateNotAlreadySet(accounts)

  bulkSetSip(sipAccounts)
}

const validateExistence = (accounts) => {
  if (!accounts.length) {
    throw new Error(errors.NO_ALLOCATION_SET)
  }
}

const validateNotAlreadySet = (accounts) => accounts.some((account) => {
  if (account.monthlyInvestment) {
    throw new Error(errors.MONTHLY_INVESTMENT_ALREADY_SET)
  }
})

const bulkSetSip = async (accounts) => Promise.all(
    accounts.map((account) => db.Account.update(
        {monthlyInvestment: account.amount},
        {where: {name: account.name}},
    )),
)

module.exports = {
  execute,
}
