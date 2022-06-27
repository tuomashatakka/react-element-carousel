const rules = {
  // 'prettier/prettier': 'warn',
  semi: ['warn', 'never'],
  'arrow-parens': 'warn',
}

const settings = {
  react: {
    version: 'detect',
  },
}

const parser = "@typescript-eslint/parser"

const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
  ecmaVersion: 8,
  sourceType: 'module',
}

const env = {
  commonjs: true,
  node: true,
  browser: true,
  es6: true,
  jest: true,
}

module.exports = {

  rules,
  parser,
  parserOptions,
  ignorePatterns: ['node_modules/'],
  settings,
  globals: {},
  env,
  
  extends: [
    'eslint:recommended', 
    'plugin:react/recommended'
  ],
  
  plugins: [
    'prettier', 
    '@typescript-eslint', 
    'react', 
    'import', 
    'react-hooks'
  ],
}
