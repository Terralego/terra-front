/**
 * t function mock to get mocked translations in component.
 * Components will provide a way to get the real `t()` function as prop.
 */

export default (config = {}) => (key, params = {}) =>
  Object.keys(params).reduce((prev, next) =>
    prev.replace(new RegExp(`{{${next}}}`, 'g'), params[next]),
  (params.context && config[`${key}_${params.context}`]) || config[key] || key);
