import React from 'react';
import PropTypes from 'prop-types';
import { RangeSlider } from '@blueprintjs/core';

import './index.scss';

export const Range = ({
  label,
  values,
  value,
  onChange,
  ...props
}) => {
  const val = value.length ? value : values;
  if (val.length !== 2 || (+val[0] > +val[1])) {
    throw new Error('Range control: There must be two values and the first must be less than the second');
  }
  return (
    <div className="control-container">
      <p className="control-label">{label}</p>
      <RangeSlider
        value={val}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

Range.propTypes = {
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.number),
  values: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

Range.defaultProps = {
  label: '',
  value: [],
  values: [],
  onChange () {},
};

export default Range;
