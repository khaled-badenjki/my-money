const { expect } = require('chai')
const calculator = require('../../../src/helpers/calculator')

describe('Calculator', () => {
  describe('calculatePercentages', () => {
    it('should calculate percentage correctly', () => {
      expect(calculator.calculatePercentages([6000, 3000, 1000]))
        .to.eql([60, 30, 10])
    })
  
    it('should return integers that sum up to 100', () => {
      expect(calculator.calculatePercentages([3000, 3000, 3000]))
        .to.eql([33, 33, 34])
    })

    it('should automatically convert numeric string to number', () => {
      expect(calculator.calculatePercentages(['6000', '3000', '1000']))
        .to.eql([60, 30, 10])
    })
  })

  describe('floor', () => {
    it('should floor the number', () => {
      expect(calculator.floor(1.5)).to.eql(1)
    })
  })
})
