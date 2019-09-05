import React from 'react';
import PropTypes from 'prop-types';
import {
  RangeSlider,
  NumericInput,
  Intent,
  FormGroup,
} from '@blueprintjs/core';

import './index.scss';
import translateMock from '../../../utils/translate';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

/**
 * Range component that allows editing either by a slider or 2 numeric inputs
 */
export class Range extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    translate: PropTypes.func,
    /** Number of steps for when to switch to 2 numeric inputs */
    threshold: PropTypes.number,
    stepSize: PropTypes.number,
  };

  static defaultProps = {
    label: '',
    value: undefined,
    onChange () {},
    min: DEFAULT_MIN,
    max: DEFAULT_MAX,
    translate: translateMock({
      'terralego.forms.controls.range_from': 'From',
      'terralego.forms.controls.range_to': 'to',
    }),
    threshold: 250,
    stepSize: 1,
  };

  constructor (props) {
    super(props);
    const { min, max, value = [min, max] } = props;
    this.state = { range: value.length === 2 ? value : [min, max] };
  }

  componentDidUpdate (prevProps) {
    this.updateRangeFromProps(prevProps);
  }

  onNumericInputChange = pos => bound => {
    const { onChange, min, max } = this.props;
    const { range } = this.state;
    range[pos] = bound;
    this.setState({ range });

    const [lowerBound, upperBound] = range;
    // Check that the values are within min/max, it will be eventually be
    // clamped, but we need to prevent firing onChange
    if (lowerBound <= upperBound && min <= lowerBound && upperBound <= max) {
      onChange(range);
    }
  };

  /**
   * This replace the current range if the prop value changed, it keeps it
   * within new min/max bounds
   */
  updateRangeFromProps ({ value: prevValue, min: prevMin, max: prevMax }) {
    const { value, min, max } = this.props;
    if (value && prevValue !== value && value.length === 2) {
      const [lowerBound, upperBound] = value;
      this.setState({
        range: [
          Math.max(lowerBound, min),
          Math.min(upperBound, max),
        ],
      });
    }
    if (prevMin !== min || prevMax !== max) {
      this.setState({ range: [min, max] });
    }
  }

  render () {
    const {
      label,
      onChange,
      min,
      max,
      inputProps,
      translate,
      threshold,
      stepSize,
      ...otherProps
    } = this.props;
    const { range, range: [lowerBound, upperBound] } = this.state;

    const tooManyValues = (max - min) / stepSize > threshold;
    const numericInputProps = {
      selectAllOnFocus: true,
      clampValueOnBlur: true,
      buttonPosition: 'none',
      ...otherProps,
      type: undefined, // This resets the type given by Control
      min,
      max,
      intent: lowerBound > upperBound ? Intent.DANGER : undefined,
    };

    return (
      <div className="control-container control--range range">
        <p className="control-label">{label}</p>
        {tooManyValues && (
          <div className="control--range__numeric">
            <FormGroup
              className="bp3-inline"
              label={translate('terralego.forms.controls.range_from')}
            >
              <NumericInput
                {...numericInputProps}
                onValueChange={this.onNumericInputChange(0)}
                value={lowerBound}
              />
            </FormGroup>
            <FormGroup
              className="bp3-inline"
              label={translate('terralego.forms.controls.range_to')}
            >
              <NumericInput
                {...numericInputProps}
                onValueChange={this.onNumericInputChange(1)}
                value={upperBound}
              />
            </FormGroup>
          </div>
        )}
        {!tooManyValues && (
          <RangeSlider
            className="control--range__slider"
            {...otherProps}
            value={range}
            min={min}
            max={max}
            onRelease={onChange}
            onChange={value => this.setState({ range: value })}
            stepSize={stepSize}
          />
        )}
      </div>
    );
  }
}

export default Range;
