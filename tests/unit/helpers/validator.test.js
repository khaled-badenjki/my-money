const {expect} = require('chai')
const validator = require('../../../src/helpers/validator')
const {errors} = require('../../../config')


describe('Validator', () => {
  describe('validateAllocate', () => {
    it('should pass if all inputs are valid', () => {
      const input = ['100', '200', '300']
      expect(validator.validateAllocate(input)).to.be.true
      expect(() => validator.validateAllocate(input)).not.to.throw()
    })

    it('should throw an error if any input is missing', () => {
      const input = ['100', '200', '']
      expect(() => validator.validateAllocate(input))
          .to.throw(errors.MISSING_INPUT)
    })

    it('should fail if any input is not a number', () => {
      const input = ['100', '200', 'abc']
      expect(() => validator.validateAllocate(input))
          .to.throw(errors.INPUT_NOT_NUMBER)
    })

    it('should fail if any input is negative', () => {
      const input = ['100', '200', '-300']
      expect(() => validator.validateAllocate(input))
          .to.throw(errors.INPUT_NEGATIVE)
    })
  })

  describe('validateSip', () => {
    it('should pass if all inputs are valid', () => {
      const input = ['100', '200', '300']
      expect(validator.validateSip(input)).to.be.true
      expect(() => validator.validateSip(input)).not.to.throw()
    })

    it('should fail if any input is missing', () => {
      const input = ['100', '200', '']
      expect(() => validator.validateSip(input))
          .to.throw(errors.MISSING_INPUT)
    })

    it('should fail if any input is not a number', () => {
      const input = ['100', '200', 'abc']
      expect(() => validator.validateSip(input))
          .to.throw(errors.INPUT_NOT_NUMBER)
    })

    it('should fail if any input is negative', () => {
      const input = ['100', '200', '-300']
      expect(() => validator.validateSip(input))
          .to.throw(errors.INPUT_NEGATIVE)
    })
  })

  describe('validateChange', () => {
    const month = 'JANUARY'
    it('should pass if all inputs are valid', () => {
      const input = ['100%', '200%', '300%']
      expect(validator.validateChange(input, month)).to.be.true
      expect(() => validator.validateChange(input, month)).not.to.throw()
    })

    it('should pass if input is in negative', () => {
      const input = ['-100%', '-200%', '-300%']
      expect(validator.validateChange(input, month)).to.be.true
      expect(() => validator.validateChange(input, month)).not.to.throw()
    })

    it('should fail if month name is invalid', () => {
      const input = ['100%', '200%', '300%']
      expect(() => validator.validateChange(input, 'JANUARYY'))
          .to.throw(errors.INVALID_MONTH)
    })

    it('should fail if any input is missing', () => {
      const input = ['100%', '200%', '']
      expect(() => validator.validateChange(input, 'JANUARY'))
          .to.throw(errors.MISSING_INPUT)
    })

    it('should fail if any input is not a number', () => {
      const input = ['100%', '200%', 'abc%']
      expect(() => validator.validateChange(input, 'JANUARY'))
          .to.throw(errors.INPUT_NOT_NUMBER)
    })

    it('should fail if any input is not a percentage', () => {
      const input = ['100', '200', '300']
      expect(() => validator.validateChange(input, month))
          .to.throw(errors.INPUT_NOT_PERCENTAGE)
    })
  })
})
