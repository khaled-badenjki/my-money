const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')
const { balanceService } = require('../../src/services')

const callBalance = args => 
  program.parseAsync(['node', 'index.js', 'BALANCE', ...args])

describe('commands/balance', () => {
  describe('success', () => {
    beforeEach(() => {
      sinon.stub(logger, 'info')
    })
  
    afterEach(() => {
      logger.info.restore()
    })
    it('should call the balanceService.execute', () => {
      sinon.stub(balanceService, 'execute')

      callBalance(['APRIL'])
      expect(balanceService.execute.calledOnce).to.be.true
      expect(balanceService.execute.calledWith('APRIL')).to.be.true

      balanceService.execute.restore()
    })

    it('should print the balance', async () => {
      sinon.stub(balanceService, 'execute').returns([
        { name: 'equity', balance: 1000 },
        { name: 'debt', balance: 5000 },
        { name: 'gold', balance: 2000 },

      ])

      await callBalance(['APRIL'])

      expect(logger.info.calledOnce).to.be.true
      expect(logger.info.calledWith('1000 5000 2000')).to.be.true

      balanceService.execute.restore()
    })

    it('should order the output as equity -> debt -> gold', async () => {
      sinon.stub(balanceService, 'execute').returns([
        { name: 'gold', balance: 2000 },
        { name: 'equity', balance: 1000 },
        { name: 'debt', balance: 5000 },
      ])

      await callBalance(['APRIL'])

      expect(logger.info.calledOnce).to.be.true
      expect(logger.info.calledWith('1000 5000 2000')).to.be.true

      balanceService.execute.restore()
    })
  })

  describe('failure', () => {

  
    beforeEach(() => {
      sinon.stub(logger, 'error')
      sinon.stub(balanceService, 'execute')
        .rejects(new Error('Invalid input'))
    })
  
    afterEach(() => {
      logger.error.restore()
      balanceService.execute.restore()
    })

    it('should log error message', async () => {
      await callBalance([''])

      expect(logger.error.calledWith(sinon.match(/Invalid input/))).to.be.true
    })
  })
})
