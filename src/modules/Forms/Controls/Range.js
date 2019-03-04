import React from 'react';
import PropTypes from 'prop-types';
import { RangeSlider } from '@blueprintjs/core';

import './index.scss';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

export const Range = ({
  label,
  value,
  onChange,
  min,
  max,
  ...props
}) => {
  if (value && (value.length !== 2 || (+value[0] > +value[1]))) {
    throw new Error('Range control: There must be two values and the first must be less than the second');
  }
  return (
    <div className="control-container">
      <p className="control-label">{label}</p>
      <RangeSlider
        value={value || [min, max]}
        onChange={onChange}
        min={min}
        max={max}
        {...props}
      />
    </div>
  );
};

Range.propTypes = {
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
};

Range.defaultProps = {
  label: '',
  value: null,
  onChange () {},
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
};

export default Range;
