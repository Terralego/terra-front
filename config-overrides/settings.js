const path = require('path');

module.exports = {
  modulesPaths: [
    path.resolve(__dirname, '../custom_modules'),
    path.resolve(__dirname, '../src'),
    path.resolve(__dirname, '../core_modules'),
  ],
};
