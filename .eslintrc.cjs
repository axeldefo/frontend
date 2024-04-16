module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'no-unused-vars': 'warn',
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ], 
    'no-multiple-empty-lines': [
      'error', 
      { 'max': 1 }
    ],
    'parserOpts': {
      'sourceType': 'module'
    }
  }
};
