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
  })
})
