import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from '@blueprintjs/core';

import './index.scss';

export const Text = ({ label, onChange, value }) => (
  <div className="control-container">
    <p className="control-label">{label}</p>
    <InputGroup
      onChange={({ target: { value: v } }) => onChange(v)}
      value={value}
    />
  </div>
);

Text.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

Text.defaultProps = {
  label: '',
  onChange () {},
  value: '',
};

export default Text;
