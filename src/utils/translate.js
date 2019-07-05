/**
 * t function mock to get mocked translations in component.
 * Components will provide a way to get the real `t()` function as prop.
 */
export default (config = {}) => (key, ...params) => {
  if (params.length) {
    return Object.keys(params[0]).reduce((str, param) => (
      (str.includes(`{{${param}}}`))
        ? str.replace(`{{${param}}}`, params[0][param])
        : str
    ), config[key]);
  }

  return config[key] || key;
};
