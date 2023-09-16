/* eslint-disable require-jsdoc */
'use strict'
const {
  Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      // define association here
      Account.hasMany(models.Operation, {
        foreignKey: 'accountId',
        as: 'operations',
      })
    }
  }
  Account.init({
    name: DataTypes.STRING,
    monthlyInvestment: DataTypes.INTEGER,
    desiredAllocationPercentage: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Account',
  })
  return Account
}
