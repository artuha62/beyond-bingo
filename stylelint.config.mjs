export default {
  extends: ['stylelint-config-rational-order'],
  plugins: ['stylelint-order'],
  rules: {
    'plugin/rational-order': [
      true,
      {
        'border-in-box-model': false,
        'empty-line-between-groups': true,
      },
    ],
  },
}
