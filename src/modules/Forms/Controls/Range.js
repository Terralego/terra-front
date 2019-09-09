import PropTypes from 'prop-types';
import React from 'react';

import './index.scss';
import RangeNumeric from './RangeNumeric';
import RangeSlider from './RangeSlider';

export const DEFAULT_MIN = 0;
export const DEFAULT_MAX = 100;

/**
 * Range component that allows editing either by a slider or 2 numeric inputs
 */
export const Range = props => {
  const {
    label,
    min,
    max,
    threshold,
    stepSize,
    value,
  } = props;
  const Component = (max - min) / stepSize > threshold ? RangeNumeric : RangeSlider;

  return (
    <div className="control-container control--range range">
      <p className="control-label">{label}</p>
      <Component
        {...props}
        value={(!Array.isArray(value) || value.length !== 2) ? [min, max] : value}
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
  /** Number of steps for when to switch to 2 numeric inputs */
  threshold: PropTypes.number,
  stepSize: PropTypes.number,
};

Range.defaultProps = {
  label: '',
  value: undefined,
  onChange () {},
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
  threshold: 250,
  stepSize: 1,
};

export default Range;
