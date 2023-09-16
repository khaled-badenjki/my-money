const sinon = require('sinon')
const {expect} = require('chai')
const logger = require('../../../src/helpers/logger')
const program = require('../../../src/commands')
const {changeService} = require('../../../src/services')

const callChange = (args) =>
  program.parseAsync(['node', 'index.js', 'CHANGE', ...args])

describe('commands/change', () => {
  describe('success', () => {
    it('should call the changeService.execute', () => {
      sinon.stub(changeService, 'execute')

      callChange(['10%', '20%', '30%', 'APRIL'])
      expect(changeService.execute.calledOnce).to.be.true
      expect(changeService.execute.args[0][0]).to.deep.equal([
        {name: 'equity', change: 10},
        {name: 'debt', change: 20},
        {name: 'gold', change: 30},
      ], '04')

      changeService.execute.restore()
    })
  })

  describe('failure', () => {
    it('should print the error message', async () => {
      sinon.stub(changeService, 'execute').throws(new Error('ERROR_MESSAGE'))

      await callChange(['10%', '20%', '30%', 'APRIL'])

      expect(logger.error.calledOnce).to.be.true
      expect(logger.error.args[0][0]).to.equal('ERROR_MESSAGE')

      changeService.execute.restore()
    })
  })
})
