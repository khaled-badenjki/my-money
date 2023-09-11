const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')
const { changeService } = require('../../src/services')

const callChange = args => 
  program.parseAsync(['node', 'index.js', 'CHANGE', ...args])

describe('commands/change', () => {
  describe('interaction', () => {
    it('should call the changeService.execute', () => {
      sinon.stub(changeService, 'execute')

      callChange(['10%', '20%', '30%', 'APRIL'])
      expect(changeService.execute.calledOnce).to.be.true
      expect(changeService.execute.calledWith([
        { name: 'equity', change: 10 },
        { name: 'debt', change: 20 },
        { name: 'gold', change: 30 }
      ], 'APRIL')).to.be.true

      changeService.execute.restore()
    })
  })
})
