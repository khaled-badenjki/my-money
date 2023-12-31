module.exports = {
  errors: {
    ERROR: 'ERROR',
    ALREADY_ALLOCATED: 'ALREADY_ALLOCATED',
    MISSING_INPUT: 'MISSING_INPUT',
    INPUT_NOT_NUMBER: 'INPUT_NOT_NUMBER',
    INPUT_NEGATIVE: 'INPUT_NEGATIVE',
    INPUT_NOT_PERCENTAGE: 'INPUT_NOT_PERCENTAGE',
    INVALID_MONTH: 'INVALID_MONTH',
    NO_ALLOCATION_SET: 'NO_ALLOCATION_SET',
    MONTHLY_INVESTMENT_ALREADY_SET: 'MONTHLY_INVESTMENT_ALREADY_SET',
    CANNOT_REBALANCE: 'CANNOT_REBALANCE',
    PREVIOUS_MONTH_NOT_SET: 'PREVIOUS_MONTH_NOT_SET',
    NO_ACCOUNTS_FOUND: 'NO_ACCOUNTS_FOUND',
  },

  months: {
    JANUARY: '01',
    FEBRUARY: '02',
    MARCH: '03',
    APRIL: '04',
    MAY: '05',
    JUNE: '06',
    JULY: '07',
    AUGUST: '08',
    SEPTEMBER: '09',
    OCTOBER: '10',
    NOVEMBER: '11',
    DECEMBER: '12',
  },

  constants: {
    ALLOCATION: 'allocation',
    SIP: 'sip',
    REBALANCE: 'rebalance',
    CHANGE: 'change',
    EQUITY: 'equity',
    DEBT: 'debt',
    GOLD: 'gold',
  },

  defaults: {
    SIP_START_MONTH: '02',
    ALLOCATION_DATE: '2023-01-15',
    YEAR: '2023',
    DAY: '15',
    NEXT_DAY: '16',
    EQUITY: 'equity',
    DEBT: 'debt',
    GOLD: 'gold',
  },
}
