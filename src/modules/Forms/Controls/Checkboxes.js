import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@blueprintjs/core';

import './index.scss';

export function toggleValue (array, value) {
  return array.includes(value)
    ? [...array.filter(val => val !== value)]
    : [...array, value];
}

export const Checkboxes = ({ label, values, value, onChange }) => (
  <div className="control-container">
    <p className="control-label">{label}</p>
    {values.map(val =>
      <Checkbox key={val} onChange={() => onChange(toggleValue(value, val))} label={val} />)}
  </div>
);

Checkboxes.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  values: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

Checkboxes.defaultProps = {
  label: '',
  value: [],
  values: [],
  onChange () {},
};

export default Checkboxes;
