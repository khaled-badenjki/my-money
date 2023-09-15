const db = require('../dal/models')

const execute = async sipAccounts => {

  const account = await db.Account.findOne({
    where: { monthlyInvestment: { [db.Sequelize.Op.ne]: null } }
  })

  if (account) {
    throw new Error('MONTHLY_INVESTMENT_ALREADY_SET')
  }

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
