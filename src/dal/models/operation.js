/* eslint-disable require-jsdoc */
'use strict'
const {
  Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Operation extends Model {
    static associate(models) {
      // define association here
      Operation.Account = Operation.belongsTo(models.Account, {
        foreignKey: 'accountId',
        as: 'account',
      })
    }
  }
  Operation.init({
    amount: DataTypes.INTEGER,
    type: DataTypes.STRING,
    date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Operation',
  })
  return Operation
}
