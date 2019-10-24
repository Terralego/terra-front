import React from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_MIN, DEFAULT_MAX } from './Range';

const rangeIsEqual = (a, b) => {
  if (a === b) {
    return true;
  }
  return Array.isArray(a) && a.length === 2
    && Array.isArray(b) && b.length === 2
    && a[0] === b[0] && a[1] === b[1];
};

/**
 * Slider for editing a range.
 */
class RangeComponent extends React.Component {
  // eslint-disable-next-line react/destructuring-assignment
  defaultValue = [this.props.min, this.props.max];

  // eslint-disable-next-line react/destructuring-assignment
  state = { range: this.props.value || this.defaultValue };

  componentDidUpdate (prevProps) {
    const { min, max, value } = this.props;
    const { range } = this.state;

    // range set by user or defaulted to min-max
    const rangeModified = range !== value && range !== this.defaultValue;

    // If min/max prop changed, force-update the range
    if (prevProps.min !== min || prevProps.max !== max) {
      if (rangeModified) {
        // Within min/max if range had already been set
        const [lowerBound, upperBound] = range;
        this.setRange([Math.max(lowerBound, min), Math.min(upperBound, max)]);
      } else {
        this.setRange([min, max]);
      }
    }
    if (!rangeIsEqual(prevProps.value, value) && Array.isArray(value) && value.length === 2) {
      const [lowerBound, upperBound] = value;
      this.setRange([lowerBound, upperBound]);
    }
  }

  setRange = range => {
    this.setState({ range });
  };
}

RangeComponent.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  min: PropTypes.number,
  max: PropTypes.number,
};

RangeComponent.defaultProps = {
  value: undefined,
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
};

export default RangeComponent;
