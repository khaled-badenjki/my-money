module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true,
    'mocha': true,

  },
  'extends': 'google',
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
  },
  'rules': {
    'no-unused-vars': 'off',
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'eol-last': ['error', 'always'],
    'max-len': ['error', {'code': 81}],
  },
}
