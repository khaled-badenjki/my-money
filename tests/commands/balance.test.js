const sinon = require('sinon')
const { expect } = require('chai')
const { logger } = require('../../src/helpers/logger')
const program = require('../../src/commands')
const { balanceService } = require('../../src/services')

const callBalance = args => 
  program.parseAsync(['node', 'index.js', 'BALANCE', ...args])

describe('commands/balance', () => {
  describe('interaction', () => {
    it('should call the balanceService.execute', () => {
      sinon.stub(balanceService, 'execute')

      callBalance(['APRIL'])
      expect(balanceService.execute.calledOnce).to.be.true
      expect(balanceService.execute.calledWith('APRIL')).to.be.true

      balanceService.execute.restore()
    })

    it('should log error if month name is not valid', async () => {
      sinon.stub(balanceService, 'execute')
        .throws(new Error('Invalid month name'))
      sinon.stub(logger, 'error')

      await callBalance(['INVALID'])

      expect(logger.error.calledOnce).to.be.true
      expect(logger.error.calledWith('Invalid month name')).to.be.true

      balanceService.execute.restore()
      logger.error.restore()
    })

    it('should log the balance', async () => {
      sinon.stub(balanceService, 'execute').returns([
        { name: 'equity', balance: 1000 },
        { name: 'debt', balance: 5000 },
        { name: 'gold', balance: 2000 },

      ])
      sinon.stub(logger, 'info')

      await callBalance(['APRIL'])

      expect(logger.info.calledOnce).to.be.true
      expect(logger.info.calledWith('1000 5000 2000')).to.be.true

      balanceService.execute.restore()
      logger.info.restore()
    })

    it('should order the output as equity -> debt -> gold', async () => {
      sinon.stub(balanceService, 'execute').returns([
        { name: 'gold', balance: 2000 },
        { name: 'equity', balance: 1000 },
        { name: 'debt', balance: 5000 },
      ])
      sinon.stub(logger, 'info')

      await callBalance(['APRIL'])

      expect(logger.info.calledOnce).to.be.true
      expect(logger.info.calledWith('1000 5000 2000')).to.be.true

      balanceService.execute.restore()
      logger.info.restore()    
    })
  })
})
