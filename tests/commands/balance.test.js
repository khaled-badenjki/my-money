const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')
const services = require('../../src/services')

const callBalance = args => 
  program.parseAsync(['node', 'index.js', 'BALANCE', ...args])

describe('commands/balance', () => {
  describe('interaction', () => {
    it('should call the services.balance', () => {
      sinon.stub(services, 'balance')

      callBalance(['APRIL'])
      expect(services.balance.calledOnce).to.be.true
      expect(services.balance.calledWith('APRIL')).to.be.true

      services.balance.restore()
    })

    it('should log error if month name is not valid', async () => {
      sinon.stub(services, 'balance').throws(new Error('Invalid month name'))
      sinon.stub(logger, 'error')

      await callBalance(['INVALID'])

      expect(logger.error.calledOnce).to.be.true
      expect(logger.error.calledWith('Invalid month name')).to.be.true

      services.balance.restore()
      logger.error.restore()
    })
  })
})
