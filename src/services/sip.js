const db = require('../dal/models')

const execute = async sipAccounts => {
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
