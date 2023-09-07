module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true,
    'mocha': true

  },
  'extends': 'eslint:recommended',
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'eol-last': ['error', 'always'],
  }
}
