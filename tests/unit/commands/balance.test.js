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
  let loggerStub
  let balanceServiceStub
  
  describe('success', () => {
    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info')
      balanceServiceStub = sinon.stub(balanceService, 'execute').returns([
        { name: 'equity', balance: 1000 },
        { name: 'debt', balance: 5000 },
        { name: 'gold', balance: 2000 },
      ])
    })
  
    afterEach(() => {
      loggerStub.restore()
      balanceServiceStub.restore()
    })
    it('should call the balanceService.execute', () => {
      callBalance(sampleArgs)
      expect(balanceServiceStub.calledOnce).to.be.true
      expect(balanceServiceStub.args[0][0]).to.equal(month)
    })

    it('should print the balance', async () => {
      await callBalance(sampleArgs)

      expect(loggerStub.calledOnce).to.be.true
      expect(loggerStub.args[0][0]).to.equal('1000 5000 2000')

    })

    it('should order the output as equity -> debt -> gold', async () => {
      balanceServiceStub.restore()
      balanceServiceStub = sinon.stub(balanceService, 'execute').returns([
        { name: 'gold', balance: 2000 },
        { name: 'equity', balance: 1000 },
        { name: 'debt', balance: 5000 },
      ])

      await callBalance(sampleArgs)

      expect(loggerStub.calledOnce).to.be.true
      expect(loggerStub.args[0][0]).to.equal('1000 5000 2000')

      balanceService.execute.restore()
    })
  })

  describe('failure', () => {
  
    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'error')
      balanceServiceStub = sinon.stub(balanceService, 'execute')
        .rejects(new Error('Invalid input'))
    })
  
    afterEach(() => {
      loggerStub.restore()
      balanceServiceStub.restore()
    })

    it('should log error message', async () => {
      await callBalance([''])

      expect(loggerStub.args[0][0]).to.equal('Invalid input')
    })
  })
})
