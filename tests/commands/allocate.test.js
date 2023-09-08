const sinon = require('sinon')
const { expect } = require('chai')
const program = require('../../commands')

describe('commands/allocate', () => {
  let consoleLogStub

  before(() => {
    consoleLogStub = sinon.stub(console, 'log')
  })

  after(() => {
    consoleLogStub.restore()
  })

  it('should log ALLOCATE to the console', () => {
    process.argv = ['node', 'index.js', 'allocate']
    
    program.parse(process.argv)

    expect(consoleLogStub.calledWith('ALLOCATE')).to.be.true
  })
})
