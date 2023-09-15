const sinon = require('sinon')
const { expect } = require('chai')
const logger = require('../../../src/helpers/logger')
const program = require('../../../src/commands')
const { balanceService } = require('../../../src/services')
const { months } = require('../../../config')


const callBalance = args => 
  program.parseAsync(['node', 'index.js', 'BALANCE', ...args])

const sampleArgs = ['APRIL']
const month = months.APRIL
  
describe('commands/balance', () => {
  let balanceServiceStub
  
  describe('success', () => {
    beforeEach(() => {
      balanceServiceStub = sinon.stub(balanceService, 'execute').returns([
        { name: 'equity', balance: 1000 },
        { name: 'debt', balance: 5000 },
        { name: 'gold', balance: 2000 },
      ])
    })
  
    afterEach(() => {
      balanceServiceStub.restore()
    })
    it('should call the balanceService.execute', () => {
      callBalance(sampleArgs)
      expect(balanceServiceStub.calledOnce).to.be.true
      expect(balanceServiceStub.args[0][0]).to.equal(month)
    })

    it('should print the balance', async () => {
      await callBalance(sampleArgs)

      expect(logger.info.calledOnce).to.be.true
      expect(logger.info.args[0][0]).to.equal('1000 5000 2000')

    })

    it('should order the output as equity -> debt -> gold', async () => {
      balanceServiceStub.restore()
      balanceServiceStub = sinon.stub(balanceService, 'execute').returns([
        { name: 'gold', balance: 2000 },
        { name: 'equity', balance: 1000 },
        { name: 'debt', balance: 5000 },
      ])

      await callBalance(sampleArgs)

      expect(logger.info.calledOnce).to.be.true
      expect(logger.info.args[0][0]).to.equal('1000 5000 2000')

      balanceService.execute.restore()
    })
  })

  describe('failure', () => {
  
    beforeEach(() => {
      balanceServiceStub = sinon.stub(balanceService, 'execute')
        .rejects(new Error('ERROR_MESSAGE'))
    })
  
    afterEach(() => {
      balanceServiceStub.restore()
    })

    it('should log error message', async () => {
      await callBalance([''])

      expect(logger.error.args[0][0]).to.equal('ERROR_MESSAGE')
    })

    it('should fail if month is not valid', async () => {
      await callBalance(['invalid'])

      expect(logger.error.args[0][0]).to.equal('INVALID_MONTH')
    })
  })
})
