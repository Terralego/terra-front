import React from 'react';
import PropTypes from 'prop-types';
import { Switch as BPSwitch } from '@blueprintjs/core';

import './index.scss';

export const Switch = ({ label, value, onChange }) => (
  <div className="control-container">
    <BPSwitch
      className="control-label"
      label={label}
      onChange={({ target: { checked } }) => onChange(checked)}
      checked={value}
    />
  </div>
);

Switch.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.bool,
};

Switch.defaultProps = {
  label: '',
  onChange () {},
  value: false,
};

export default Switch;
