import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { RangeSlider } from '@blueprintjs/core';
import ContentEditable from 'react-contenteditable';

import './index.scss';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

const handleManualChange = ({
  onChange, prevMin, prevMax, newMin, newMax, min, max,
}) => {
  if (newMin !== undefined) {
    onChange([Math.min(max, Math.min(newMin, prevMax)), prevMax]);
  }
  if (newMax !== undefined) {
    onChange([prevMin, Math.max(min, Math.max(prevMin, newMax))]);
  }
};

const selectAll = ({ target }) => {
  const selection = global.getSelection();
  const range = document.createRange();
  range.selectNodeContents(target);
  selection.removeAllRanges();
  selection.addRange(range);
};

export const Range = ({
  label,
  value,
  onChange,
  min,
  max,
  ...props
}) => {
  const [minValue, maxValue] = value || [min, max];

  if (value && (value.length !== 2 || (+minValue > +maxValue))) {
    throw new Error('Range control: There must be two values and the first must be less than the second');
  }

  const [newMin, setMin] = useState();
  const [newMax, setMax] = useState();
  const [blured, setBlured] = useState(false);

  useEffect(() => {
    if (blured) {
      handleManualChange({
        onChange,
        prevMin: minValue,
        prevMax: maxValue,
        newMin,
        newMax,
        min,
        max,
      });
      setMin();
      setMax();
      setBlured(false);
    }
  }, [blured]);

  return (
    <div className="control-container control--range range">
      <p className="control-label">{label}</p>
      <RangeSlider
        value={value || [min, max]}
        onChange={onChange}
        min={min}
        max={max}
        labelRenderer={itemValue => {
          if (+itemValue === minValue || +itemValue === maxValue) {
            const minChanged = +itemValue === minValue;
            const maxChanged = !minChanged;
            const inputValue = minChanged
              ? newMin
              : newMax;
            return (
              <ContentEditable
                className="range__manual"
                onChange={({ target: { value: newValue } }) => {
                  const fixedNewValue = Number.isNaN(+newValue)
                    ? 0
                    : +newValue;
                  if (minChanged) {
                    setMin(fixedNewValue);
                  }
                  if (maxChanged) {
                    setMax(fixedNewValue);
                  }
                }}
                html={`${inputValue === undefined ? itemValue : inputValue}`}
                onBlur={() => setBlured(true)}
                onFocus={selectAll}
              />
            );
          }
          return itemValue;
        }}
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
