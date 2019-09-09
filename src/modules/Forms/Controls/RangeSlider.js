import React, { useState, useEffect } from 'react';
import { RangeSlider as BPRangeSlider } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import { DEFAULT_MIN, DEFAULT_MAX } from './Range';

/**
 * Slider for editing a range.
 */
const RangeSlider = ({ onChange, value, ...props }) => {
  const { min, max } = props;
  const [range, setRange] = useState(value);

  useEffect(() => {
    // When min or max change, update the range accordingly
    setRange([min, max]);
  }, [min, max]);

  useEffect(() => {
    // If value prop changes, update the range accordingly, within min/max
    if (Array.isArray(value) && value.length === 2) {
      const [lowerBound, upperBound] = value;
      setRange([Math.max(lowerBound, min), Math.min(upperBound, max)]);
    }
  }, [value, min, max]);

  return (
    <BPRangeSlider
      className="control--range__slider"
      value={range}
      onRelease={onChange}
      onChange={v => setRange(v)}
      {...props}
    />
  );
};

RangeSlider.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
};

RangeSlider.defaultProps = {
  value: undefined,
  onChange () {},
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
};

export default RangeSlider;
