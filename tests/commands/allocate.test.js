const sinon = require('sinon')
const { expect } = require('chai')
const program = require('../../src/commands')
const logger = require('../../src/helpers/logger')
const { accountService, operationService } = require('../../src/services')

describe('commands/allocate', () => {
  let loggerStub

  before(() => {
    loggerStub = sinon.stub(logger, 'info')
  })

  after(() => {
    loggerStub.restore()
  })

  it('should log ALLOCATE as info', () => {
    program.parse(['node', 'index.js', 'allocate', '6000', '3000', '1000'])

    expect(loggerStub.calledWith(sinon.match(/ALLOCATE/))).to.be.true
  })

  it('should parse the input values in correct order', () => {
    const params = {
      equity: '6000',
      debt: '3000',
      gold: '1000'
    }

    program.parse(['node', 'index.js', 'allocate',
      params.equity, 
      params.debt, 
      params.gold
    ])

    expect(program.args).to.deep.equal([
      'allocate',
      params.equity, 
      params.debt, 
      params.gold
    ])

    expect(loggerStub.calledWith(
      `ALLOCATE EQUITY:${params.equity}, ` +
      `DEBT:${params.debt}, ` +
      `GOLD:${params.gold}`
    )).to.be.true
  })

  it ('should call the account service with the correct params', () => {
    const params = {
      equity: '6000',
      debt: '3000',
      gold: '1000'
    }

    const accountServiceStub = sinon
      .stub(accountService, 'setDesiredAllocationPercentage')
      .resolves()

    program.parse(['node', 'index.js', 'allocate',
      params.equity, 
      params.debt, 
      params.gold
    ])

    expect(accountServiceStub.calledWith({
      equity: params.equity, 
      debt: params.debt, 
      gold: params.gold
    })).to.be.true

    accountServiceStub.restore()
  })

  it('should call the operation service with the correct params', () => {
    const params = {
      equity: '6000',
      debt: '3000',
      gold: '1000'
    },

    operationServiceStub = sinon
      .stub(operationService, 'createAllocations')
      .resolves()

    program.parse(['node', 'index.js', 'allocate',
      params.equity, 
      params.debt, 
      params.gold
    ])

    expect(operationServiceStub.calledWith({
      equity: params.equity, 
      debt: params.debt, 
      gold: params.gold
    })).to.be.true

    operationServiceStub.restore()
  })
})
