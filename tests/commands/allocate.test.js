const sinon = require('sinon')
const { expect } = require('chai')
const program = require('../../commands')
const logger = require('../../logger')

describe('commands/allocate', () => {
  let loggerStub

  before(() => {
    loggerStub = sinon.stub(logger, 'info')
  })

  after(() => {
    loggerStub.restore()
  })

  it('should log ALLOCATE as info', () => {
    process.argv = ['node', 'index.js', 'allocate', '6000', '3000', '1000']
    
    program.parse(process.argv)

    expect(loggerStub.calledWith(sinon.match(/ALLOCATE/))).to.be.true
  })

  it('should parse the input values in correct order', () => {
    const params = {
      equity: '6000',
      debt: '3000',
      gold: '1000'
    }
    process.argv = ['node', 'index.js', 'allocate',
      params.equity, 
      params.debt, 
      params.gold
    ]

    program.parse(process.argv)

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
})
