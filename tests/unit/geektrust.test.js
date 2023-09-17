const sinon = require('sinon')
const {expect} = require('chai')
const program = require('../../src/commands')

describe('geektrust', () => {
  let programParseAsyncStub

  beforeEach(() => {
    programParseAsyncStub = sinon.stub(program, 'parseAsync').resolves()
  })

  afterEach(() => {
    programParseAsyncStub.restore()
  })

  it('should parse file and run commands in it', async () => {
    const argv2Stub = sinon.stub(process, 'argv')
        .get(() => ['node', 'geektrust.js', 'tests/unit/input.txt'])

    require('../../geektrust')

    argv2Stub.restore()

    expect(programParseAsyncStub.calledOnce).to.be.true
  })
})
