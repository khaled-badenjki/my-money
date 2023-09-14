const sinon = require('sinon')
const logger = require('../src/helpers/logger')

// Stub logger
beforeEach(() => {
  sinon.stub(logger, 'info')
  sinon.stub(logger, 'error')
})

// Restore logger
afterEach(() => {
  sinon.restore()
})
