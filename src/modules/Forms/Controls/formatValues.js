import moize from 'moize';

export default moize(values => values.map(item => (typeof item === 'object'
  ? item
  : {
    value: item,
    label: item,
  }
)));
