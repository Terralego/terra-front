import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as BPCheckbox } from '@blueprintjs/core';

const Checkbox = ({ checked, label, onToggle, value }) => (
  <BPCheckbox
    onChange={() => onToggle(value)}
    label={label || value}
    checked={checked}
  />
);

Checkbox.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onToggle: PropTypes.func,
};

Checkbox.defaultProps = {
  value: '',
  label: '',
  checked: false,
  onToggle () {},
};

export default Checkbox;
