import React from 'react';
import PropTypes from 'prop-types';
import { RangeSlider } from '@blueprintjs/core';
import ContentEditable from 'react-contenteditable';

import './index.scss';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

export class Range extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
  };

  static defaultProps = {
    label: '',
    value: undefined,
    onChange () {},
    min: DEFAULT_MIN,
    max: DEFAULT_MAX,
  };

  state = {}

  onBlur = () => {
    this.handleManualChange();
    this.setState({ newMin: undefined, newMax: undefined });
  }

  handleManualChange = () => {
    const { onChange, min, max, value: [prevMin, prevMax] = [min, max] } = this.props;
    const { newMin, newMax } = this.state;

    if (newMin !== undefined) {
      onChange([Math.max(min, Math.min(newMin, prevMax)), prevMax]);
    }
    if (newMax !== undefined) {
      onChange([prevMin, Math.min(max, Math.max(prevMin, newMax))]);
    }
  }

  selectAll = ({ target }) => {
    const selection = global.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  onLabelEdit = ({ minChanged, maxChanged }) => ({ target: { value: newValue } }) => {
    const fixedNewValue = Number.isNaN(+newValue)
      ? 0
      : +newValue;
    if (minChanged) {
      this.setState({ newMin: fixedNewValue });
    }
    if (maxChanged) {
      this.setState({ newMax: fixedNewValue });
    }
  }

  labelRenderer = itemValue => {
    const { min, max, value: [minValue, maxValue] = [min, max] } = this.props;
    const { newMin, newMax } = this.state;
    if (+itemValue === minValue || +itemValue === maxValue) {
      const minChanged = +itemValue === minValue;
      const maxChanged = !minChanged;
      const inputValue = minChanged
        ? newMin
        : newMax;
      return (
        <ContentEditable
          className="range__manual"
          onChange={this.onLabelEdit({ minChanged, maxChanged })}
          html={`${inputValue === undefined ? itemValue : inputValue}`}
          onBlur={this.onBlur}
          onClick={this.selectAll}
          onFocus={this.selectAll}
        />
      );
    }
    return itemValue;
  }

  render () {
    const {
      label,
      value,
      onChange,
      min,
      max,
      ...props
    } = this.props;
    const [minValue, maxValue] = value || [min, max];

    if (value && (value.length !== 2 || (+minValue > +maxValue))) {
      throw new Error('Range control: There must be two values and the first must be less than the second');
    }

    return (
      <div className="control-container control--range range">
        <p className="control-label">{label}</p>
        <RangeSlider
          value={value || [min, max]}
          onChange={onChange}
          min={min}
          max={max}
          labelRenderer={this.labelRenderer}
          {...props}
        />
      </div>
    );
  }
}

export default Range;
