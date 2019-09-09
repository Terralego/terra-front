import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NumericInput, FormGroup, Intent } from '@blueprintjs/core';
import translateMock from '../../../utils/translate';
import { DEFAULT_MIN, DEFAULT_MAX } from './Range';

/**
 * Two numeric inputs for editing a range.
 */
const RangeNumeric = ({ onChange, translate, ...props }) => {
  const {
    min,
    max,
    value,
  } = props;
  const [range, setRange] = useState(value || [min, max]);
  const [intent, setIntent] = useState(undefined);

  const onNumericInputChange = pos => bound => {
    range[pos] = bound;
    setRange(range);

    // Check that the values are within min/max, it will be eventually be
    // clamped, but we need to prevent firing onChange
    const [lowerB, upperB] = range;
    if (lowerB <= upperB && min <= lowerB && upperB <= max) {
      setIntent(undefined);
      onChange(range);
    } else {
      setIntent(Intent.DANGER);
    }
  };

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

  const [lowerBound, upperBound] = range;

  const inputProps = {
    selectAllOnFocus: true,
    clampValueOnBlur: true,
    buttonPosition: 'none',
    ...props,
    type: undefined, // This resets the type given by Control
    intent,
  };

  return (
    <div className="control--range__numeric">
      <FormGroup
        className="bp3-inline"
        label={translate('terralego.forms.controls.range_from')}
      >
        <NumericInput
          {...inputProps}
          onValueChange={onNumericInputChange(0)}
          value={lowerBound}
        />
      </FormGroup>
      <FormGroup
        className="bp3-inline"
        label={translate('terralego.forms.controls.range_to')}
      >
        <NumericInput
          {...inputProps}
          onValueChange={onNumericInputChange(1)}
          value={upperBound}
        />
      </FormGroup>
    </div>
  );
};

RangeNumeric.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  translate: PropTypes.func,
};

RangeNumeric.defaultProps = {
  value: undefined,
  onChange () {},
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
  translate: translateMock({
    'terralego.forms.controls.range_from': 'From',
    'terralego.forms.controls.range_to': 'to',
  }),
};

export default RangeNumeric;
