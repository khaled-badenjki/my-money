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
    process.argv = ['node', 'index.js', 'allocate']
    
    program.parse(process.argv)

    expect(loggerStub.calledWith('ALLOCATE')).to.be.true
  })
})
