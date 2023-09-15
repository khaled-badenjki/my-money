const sinon = require('sinon')
const { expect } = require('chai')
const logger = require('../../../src/helpers/logger')
const program = require('../../../src/commands')
const { rebalanceService } = require('../../../src/services')

const callRebalance = () => 
  program.parseAsync(['node', 'index.js', 'REBALANCE'])

describe('commands/rebalance', () => {
  let rebalanceServiceStub
  
  describe('success', () => {
    beforeEach(() => {
      rebalanceServiceStub = sinon
        .stub(rebalanceService, 'execute').returns([
          { name: 'equity', rebalance: 1000 },
          { name: 'debt', rebalance: 5000 },
          { name: 'gold', rebalance: 2000 },
      ])
    })
  
    afterEach(() => {
      rebalanceServiceStub.restore()
    })

    it('should call the rebalanceService.execute', () => {
      callRebalance()
      expect(rebalanceServiceStub.calledOnce).to.be.true
      expect(rebalanceServiceStub.args[0][0]).to.not.exist
    })
  })


  describe('failure', () => {
    beforeEach(() => {
      rebalanceServiceStub = sinon
        .stub(rebalanceService, 'execute')
        .throws(new Error('error'))
    })

    afterEach(() => {
      rebalanceServiceStub.restore()
    })
    
    it('should log the error caught from rebalance service', () => {
      callRebalance()
      expect(logger.error.calledOnce).to.be.true
      expect(logger.error.args[0][0]).to.equal('error')
    })
  })
})
