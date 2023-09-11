const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')
const services = require('../../src/services')

const callChange = args => 
  program.parseAsync(['node', 'index.js', 'CHANGE', ...args])

describe('commands/change', () => {
  describe('interaction', () => {
    it('should call the services.change', () => {
      sinon.stub(services, 'change')

      callChange(['10%', '20%', '30%', 'APRIL'])
      expect(services.change.calledOnce).to.be.true
    })
  })
})
