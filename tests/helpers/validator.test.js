const { expect } = require('chai')
const validator = require('../../src/helpers/validator')

describe('Validator', () => {
  describe('validateAllocateInput', () => {
    it('should pass if all inputs are valid', () => {
      const input = ['100', '200', '300']
      expect(validator.validateAllocateInput(input)).to.be.true
      expect(() => validator.validateAllocateInput(input)).not.to.throw()
    })

    it('should throw an error if any input is missing', () => {
      const input = ['100', '200', '']
      // expect it to throw an error
      expect(() => validator.validateAllocateInput(input))
        .to.throw('MISSING_INPUT')
    })

    it('should fail if any input is not a number', () => {
      const input = ['100', '200', 'abc']
      expect(() => validator.validateAllocateInput(input))
        .to.throw('INPUT_NOT_NUMBER')
    })

    it('should fail if any input is negative', () => {
      const input = ['100', '200', '-300']
      expect(() => validator.validateAllocateInput(input))
        .to.throw('INPUT_NEGATIVE')
    })
  })

  describe('validateSipInput', () => {
    it('should pass if all inputs are valid', () => {
      const input = ['100', '200', '300']
      expect(validator.validateSipInput(input)).to.be.true
      expect(() => validator.validateSipInput(input)).not.to.throw()
    })

    it('should fail if any input is missing', () => {
      const input = ['100', '200', '']
      expect(() => validator.validateSipInput(input)).to.throw('MISSING_INPUT')
    })

    it('should fail if any input is not a number', () => {
      const input = ['100', '200', 'abc']
      expect(() => validator.validateSipInput(input))
        .to.throw('INPUT_NOT_NUMBER')
    })

    it('should fail if any input is negative', () => {
      const input = ['100', '200', '-300']
      expect(() => validator.validateSipInput(input))
        .to.throw('INPUT_NEGATIVE')
    })
  })

  describe('validateChangeInput', () => {
    it('should pass if all inputs are valid', () => {
      const input = ['100%', '200%', '300%', 'JANUARY']
      expect(validator.validateChangeInput(input)).to.be.true
      expect(() => validator.validateChangeInput(input)).not.to.throw()
    })

    it('should pass if input is in negative', () => {
      const input = ['-100%', '-200%', '-300%', 'JANUARY']
      expect(validator.validateChangeInput(input)).to.be.true
      expect(() => validator.validateChangeInput(input)).not.to.throw()
    })

    it('should fail if month name is invalid', () => {
      const input = ['100%', '200%', '300%', 'JANUARYY']
      expect(() => validator.validateChangeInput(input))
        .to.throw('INVALID_MONTH')
    })

    it('should fail if any input is missing', () => {
      const input = ['100%', '200%', '', 'JANUARY']
      expect(() => validator.validateChangeInput(input))
        .to.throw('MISSING_INPUT')
    })

    it('should fail if any input is not a number', () => {
      const input = ['100%', '200%', 'abc%', 'JANUARY']
      expect(() => validator.validateChangeInput(input))
        .to.throw('INPUT_NOT_NUMBER')
    })

    it('should fail if any input is not a percentage', () => {
      const input = ['100', '200', '300']
      expect(() => validator.validateChangeInput(input))
        .to.throw('INPUT_NOT_PERCENTAGE')
    })
  })
})
