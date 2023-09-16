const sinon = require('sinon')
const {expect} = require('chai')
const logger = require('../../../src/helpers/logger')
const program = require('../../../src/commands')
const {balanceService} = require('../../../src/services')
const {months, errors} = require('../../../config')


const callBalance = (args) =>
  program.parseAsync(['node', 'index.js', 'BALANCE', ...args])

describe('commands/balance', () => {
  let balanceServiceStub

  describe('success', () => {
    beforeEach(() => {
      balanceServiceStub = sinon.stub(balanceService, 'execute').returns([
        {name: 'equity', balance: 1000},
        {name: 'debt', balance: 5000},
        {name: 'gold', balance: 2000},
      ])
    })

    afterEach(() => {
      balanceServiceStub.restore()
    })

    it('should call the balanceService.execute', () => {
      callBalance(['APRIL'])
      expect(balanceServiceStub.calledOnce).to.be.true
      expect(balanceServiceStub.args[0][0]).to.equal(months.APRIL)
    })

    it('should print the balance', async () => {
      await callBalance(['APRIL'])

      expect(logger.info.calledOnce).to.be.true
      expect(logger.info.args[0][0]).to.equal('1000 5000 2000')
    })

    it('should order the output as equity -> debt -> gold', async () => {
      balanceServiceStub.restore()
      balanceServiceStub = sinon.stub(balanceService, 'execute').returns([
        {name: 'gold', balance: 2000},
        {name: 'equity', balance: 1000},
        {name: 'debt', balance: 5000},
      ])

      await callBalance(['APRIL'])

      expect(logger.info.calledOnce).to.be.true
      expect(logger.info.args[0][0]).to.equal('1000 5000 2000')

      balanceService.execute.restore()
    })
  })

  describe('failure', () => {
    beforeEach(() => {
      balanceServiceStub = sinon.stub(balanceService, 'execute')
          .rejects(new Error(errors.ERROR))
    })

    afterEach(() => {
      balanceServiceStub.restore()
    })

    it('should catch error message from balanceService', async () => {
      await callBalance(['APRIL'])

      expect(logger.error.args[0][0]).to.equal(errors.ERROR)
    })

    it('should fail if month is not valid', async () => {
      await callBalance(['invalid'])

      expect(logger.error.args[0][0]).to.equal('INVALID_MONTH')
    })
  })
})
