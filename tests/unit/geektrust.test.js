const sinon = require('sinon')
const {expect} = require('chai')
const db = require('../../src/dal/models')
const program = require('../../src/commands')

describe('geektrust', () => {
  let programParseAsyncStub
  let dbSyncStub

  beforeEach(() => {
    programParseAsyncStub = sinon.stub(program, 'parseAsync').resolves()
    dbSyncStub = sinon.stub(db.sequelize, 'sync').resolves()
  })

  afterEach(() => {
    programParseAsyncStub.restore()
    dbSyncStub.restore()
  })

  it('should parse file and run commands in it', async () => {
    const argv2Stub = sinon.stub(process, 'argv')
        .get(() => ['node', 'geektrust.js', 'tests/unit/input.txt'])

    await require('../../geektrust')

    argv2Stub.restore()

    expect(programParseAsyncStub.calledOnce).to.be.true
  })
})
