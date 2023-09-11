const sinon = require('sinon')
const { expect } = require('chai')
const db = require('../../src/dal/models')
const services = require('../../src/services')

describe('services', () => {
  describe('allocate service', () => {
    const ALLOCATION_DATE = '2023-01-15'
    const accounts = [
      {
        name: 'equity',
        amount: 6000
      },
      {
        name: 'debt',
        amount: 2000
      },
      {
        name: 'gold',
        amount: 2000
      }
    ]

    let accountBulkCreateStub
    let operationBulkCreateStub

    beforeEach(() => {
      accountBulkCreateStub = sinon.stub(db.Account, 'bulkCreate')
        .resolves(accounts.map((account, index) => ({
          id: index + 1,
          name: account.name,
          desiredAllocationPercentage: 0
        })))
      operationBulkCreateStub = sinon.stub(db.Operation, 'bulkCreate')
    })

    afterEach(() => {
      accountBulkCreateStub.restore()
      operationBulkCreateStub.restore()
    })

    it('should call account model to create accounts', async () => {
      await services.allocate(accounts)
      expect(accountBulkCreateStub.called).to.be.true
      expect(accountBulkCreateStub.calledWith([
        {
          name: 'equity',
          desiredAllocationPercentage: 60
        },
        {
          name: 'debt',
          desiredAllocationPercentage: 20
        },
        {
          name: 'gold',
          desiredAllocationPercentage: 20
        }
      ])).to.be.true
    })

    it('should call operation model to create operations', async () => {
      await services.allocate(accounts)
      expect(operationBulkCreateStub.called).to.be.true
      expect(operationBulkCreateStub.calledWith([
        {
          type: 'allocation',
          amount: 6000,
          accountId: 1,
          date: ALLOCATION_DATE
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 2,
          date: ALLOCATION_DATE
        },
        {
          type: 'allocation',
          amount: 2000,
          accountId: 3,
          date: ALLOCATION_DATE
        }
      ])).to.be.true
    })
  })

  describe('sip service', () => {
    const accountSip = [
      {
        name: 'equity',
        sip: 6000
      },
      {
        name: 'debt',
        sip: 2000
      },
      {
        name: 'gold',
        sip: 2000
      }
    ]

    let accountUpdateStub

    beforeEach(() => {
      accountUpdateStub = sinon.stub(db.Account, 'update')
    })

    afterEach(() => {
      accountUpdateStub.restore()
    })

    it('should call account model to update monthly investment', async () => {
      await services.sip(accountSip)

      expect(accountUpdateStub.called).to.be.true
    })
  })

  describe('change service', () => {
    const changeInput = [[
      {
        name: 'equity',
        change: 4
      },
      {
        name: 'debt',
        change: 10
      },
      {
        name: 'gold',
        change: 2
      }
    ], 'APRIL']
    
    let operationFindAllStub
    let operationCreateStub
    let accountFindAllStub

    beforeEach(() => {
      operationFindAllStub = sinon.stub(db.Operation, 'findAll')
        .resolves(
          [
            {
              accountId: 3,
              total: '1000',
            },
            {
              accountId: 2,
              total: '3000',
            },
            {
              accountId: 1,
              total: '6000',
            },
          ]
        )
      operationCreateStub = sinon.stub(db.Operation, 'bulkCreate')
      accountFindAllStub = sinon.stub(db.Account, 'findAll')
        .resolves([
          {
            id: 1,
            name: 'equity'
          },
          {
            id: 2,
            name: 'debt'
          },
          {
            id: 3,
            name: 'gold'
          }
        ])
    })

    afterEach(() => {
      operationFindAllStub.restore()
      operationCreateStub.restore()
      accountFindAllStub.restore()
    })
    
    it('should call operation model to get sum of all accounts', async () => {
      await services.change(...changeInput)
      expect(operationFindAllStub.called).to.be.true
    })

    it('should call accounts model to get all accounts', async () => {
      await services.change(...changeInput)
      expect(accountFindAllStub.called).to.be.true
    })

    it('should call operation bulkCreate with correct arguments', async () => {
      await services.change(...changeInput)
      expect(operationCreateStub.called).to.be.true
      expect(operationCreateStub.calledWith(
        [
          {
            type: 'change',
            amount: 240,
            accountId: 1,
            date: '2023-04-15',
          },
          {
            type: 'change',
            amount: 300,
            accountId: 2,
            date: '2023-04-15',
          },
          {
            type: 'change',
            amount: 20,
            accountId: 3,
            date: '2023-04-15',
          },
        ]
      )).to.be.true
    })
  })

  describe('balance service', () => {
    let operationFindAllStub
    let accountFindAllStub

    beforeEach(() => {
      operationFindAllStub = sinon.stub(db.Operation, 'findAll')
        .resolves(
          [
            {
              accountId: 3,
              total: '1000',
            },
            {
              accountId: 2,
              total: '3000',
            },
            {
              accountId: 1,
              total: '6000',
            },
          ]
        )

      accountFindAllStub = sinon.stub(db.Account, 'findAll')
        .resolves([
          {
            id: 1,
            name: 'equity'
          },
          {
            id: 2,
            name: 'debt'
          },
          {
            id: 3,
            name: 'gold'
          }
        ])
    })

    afterEach(() => {
      operationFindAllStub.restore()
      accountFindAllStub.restore()
    })

    it('should call operation model to get sum of all accounts', async () => {
      await services.balance('APRIL')
      expect(operationFindAllStub.called).to.be.true
    })

    it('should call account model to get all accounts', async () => {
      await services.balance('APRIL')
      expect(accountFindAllStub.called).to.be.true
    })

    it('should return array of account names and their balances', async () => {
      const result = await services.balance('APRIL')
      expect(result).to.deep.equal([
        {
          name: 'equity',
          balance: '6000'
        },
        {
          name: 'debt',
          balance: '3000'
        },
        {
          name: 'gold',
          balance: '1000'
        }
      ])
      operationFindAllStub.restore()
      accountFindAllStub.restore()
    })
  })
})
