const db = require('../dal/models')

const execute = async sipAccounts => {

  const existingAccounts = await db.Account.findAll()
  if (!existingAccounts.length) {
    throw new Error('NO_ALLOCATION_SET')
  }

  existingAccounts.some(account => {
    if (account.monthlyInvestment) {
      throw new Error('MONTHLY_INVESTMENT_ALREADY_SET')
    }
  })


  const accounts = Promise.all(
    sipAccounts.map(account => db.Account.update(
      { monthlyInvestment: account.sip },
      { where: { name: account.name } }
    ))
  )

  return accounts
}

module.exports = {
  execute
}
