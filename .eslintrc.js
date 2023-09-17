module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true,
    'mocha': true,

  },
  'plugins': [
    'mocha',
    'jsdoc',
  ],
  'extends': 'google',
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
  },
  'rules': {
    'no-unused-vars': 'error',
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'eol-last': ['error', 'always'],
    'max-len': ['error', {'code': 81}],
    'jsdoc/check-types': 'error',
  },
}
