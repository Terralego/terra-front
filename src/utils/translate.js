/**
 * t function mock to get mocked translations in component.
 * Components will provide a way to get the real `t()` function as prop.
 */

export default (config = {}) => (key, params = {}) => Object.keys(params).reduce((prev, next) =>
  prev.replace(next, params[next]),
config[key] || key);
