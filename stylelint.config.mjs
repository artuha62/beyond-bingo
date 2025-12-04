export default {
  extends: [
    'stylelint-config-rational-order'
  ],
  plugins: [
    'stylelint-order'
  ],
  rules: {
    // Отключаем все правила, кроме сортировки
    'plugin/rational-order': [true, {
      'border-in-box-model': false,
      'empty-line-between-groups': true
    }]
  }
};