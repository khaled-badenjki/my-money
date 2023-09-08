const { expect } = require('chai')
const calculator = require('../../helpers/calculator')

describe('Calculator', () => {
  it('should calculate percentage correctly', () => {
    expect(calculator.calculatePercentages([6000, 3000, 1000]))
      .to.eql([60, 30, 10])
  })
})
