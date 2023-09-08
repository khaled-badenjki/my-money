const { expect } = require('chai')
const calculator = require('../../helpers/calculator')

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
  })
})
