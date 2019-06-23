module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  // 自定义规则配置
  // 改完规则要重启serve
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // "indent": ["error", "tab"]

  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
