const { expect } = require('chai')
const validator = require('../../src/helpers/validator')
const { errors } = require('../../config')


describe('Validator', () => {
  describe('validateAllocateInput', () => {
    it('should pass if all inputs are valid', () => {
      const input = ['100', '200', '300']
      expect(validator.validateAllocateInput(input)).to.be.true
      expect(() => validator.validateAllocateInput(input)).not.to.throw()
    })

    it('should throw an error if any input is missing', () => {
      const input = ['100', '200', '']
      expect(() => validator.validateAllocateInput(input))
        .to.throw(errors.MISSING_INPUT)
    })

    it('should fail if any input is not a number', () => {
      const input = ['100', '200', 'abc']
      expect(() => validator.validateAllocateInput(input))
        .to.throw(errors.INPUT_NOT_NUMBER)
    })

    it('should fail if any input is negative', () => {
      const input = ['100', '200', '-300']
      expect(() => validator.validateAllocateInput(input))
        .to.throw(errors.INPUT_NEGATIVE)
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
      expect(() => validator.validateSipInput(input))
        .to.throw(errors.MISSING_INPUT)
    })

    it('should fail if any input is not a number', () => {
      const input = ['100', '200', 'abc']
      expect(() => validator.validateSipInput(input))
        .to.throw(errors.INPUT_NOT_NUMBER)
    })

    it('should fail if any input is negative', () => {
      const input = ['100', '200', '-300']
      expect(() => validator.validateSipInput(input))
        .to.throw(errors.INPUT_NEGATIVE)
    })
  })

  describe('validateChangeInput', () => {
    const month = 'JANUARY'
    it('should pass if all inputs are valid', () => {
      const input = ['100%', '200%', '300%']
      expect(validator.validateChangeInput(input, month)).to.be.true
      expect(() => validator.validateChangeInput(input, month)).not.to.throw()
    })

    it('should pass if input is in negative', () => {
      const input = ['-100%', '-200%', '-300%']
      expect(validator.validateChangeInput(input, month)).to.be.true
      expect(() => validator.validateChangeInput(input, month)).not.to.throw()
    })

    it('should fail if month name is invalid', () => {
      const input = ['100%', '200%', '300%']
      expect(() => validator.validateChangeInput(input, 'JANUARYY'))
        .to.throw(errors.INVALID_MONTH)
    })

    it('should fail if any input is missing', () => {
      const input = ['100%', '200%', '']
      expect(() => validator.validateChangeInput(input, 'JANUARY'))
        .to.throw(errors.MISSING_INPUT)
    })

    it('should fail if any input is not a number', () => {
      const input = ['100%', '200%', 'abc%']
      expect(() => validator.validateChangeInput(input, 'JANUARY'))
        .to.throw(errors.INPUT_NOT_NUMBER)
    })

    it('should fail if any input is not a percentage', () => {
      const input = ['100', '200', '300']
      expect(() => validator.validateChangeInput(input, month))
        .to.throw(errors.INPUT_NOT_PERCENTAGE)
    })
  })
})
