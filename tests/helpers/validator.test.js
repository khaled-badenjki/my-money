const { expect } = require('chai')
const validator = require('../../src/helpers/validator')

describe('Validator', () => {
  describe('validateAllocateInput', () => {
    it('should return true if all inputs are valid', () => {
      const input = ['100', '200', '300']
      expect(validator.validateAllocateInput(input)).to.be.true
    })

    it('should return false if any input is missing', () => {
      const input = ['100', '200', '']
      expect(validator.validateAllocateInput(input)).to.be.false
    })

    it('should return false if any input is not a number', () => {
      const input = ['100', '200', 'abc']
      expect(validator.validateAllocateInput(input)).to.be.false
    })

    it('should return false if any input is negative', () => {
      const input = ['100', '200', '-300']
      expect(validator.validateAllocateInput(input)).to.be.false
    })
  })

  describe('validateSipInput', () => {
    it('should return true if all inputs are valid', () => {
      const input = ['100', '200', '300']
      expect(validator.validateSipInput(input)).to.be.true
    })

    it('should return false if any input is missing', () => {
      const input = ['100', '200', '']
      expect(validator.validateSipInput(input)).to.be.false
    })

    it('should return false if any input is not a number', () => {
      const input = ['100', '200', 'abc']
      expect(validator.validateSipInput(input)).to.be.false
    })

    it('should return false if any input is negative', () => {
      const input = ['100', '200', '-300']
      expect(validator.validateSipInput(input)).to.be.false
    })
  })

  describe('validateChangeInput', () => {
    it('should return true if all inputs are valid', () => {
      const input = ['100%', '200%', '300%']
      expect(validator.validateChangeInput(input)).to.be.true
    })

    it('should return false if any input is missing', () => {
      const input = ['100%', '200%', '']
      expect(validator.validateChangeInput(input)).to.be.false
    })

    it('should return false if any input is not a number', () => {
      const input = ['100%', '200%', 'abc%']
      expect(validator.validateChangeInput(input)).to.be.false
    })

    it('should return false if any input is not a percentage', () => {
      const input = ['100', '200', '300']
      expect(validator.validateChangeInput(input)).to.be.false
    })
  })
})
