import React from 'react';
import PropTypes from 'prop-types';
import { NumericInput, FormGroup, Intent } from '@blueprintjs/core';
import debounce from 'lodash.debounce';
import translateMock from '../../../utils/translate';
import { DEFAULT_MIN, DEFAULT_MAX } from './Range';
import RangeComponent from './RangeComponent';

const sanitizeProps = ({
  fetchValues,
  labelStepSize,
  min,
  max,
  type,
  onChange,
  ...props
}) => props;

/**
 * Two numeric inputs for editing a range.
 */
class RangeNumeric extends RangeComponent {
  onChangeDebounced = debounce(range => this.props.onChange(range), 300);

  onNumericInputChange = pos => bound => {
    const { min, max } = this.props;

    if (Number.isNaN(+bound)) return; // Sanity check that allows typing '-'

    this.setState(({ range: prevRange }) => {
      const nextRange = [...prevRange];
      nextRange[pos] = bound;
      return { range: nextRange };
    });

    // Check that the values are within min/max, it will be eventually be
    // clamped, but we need to prevent firing onChange
    const { range: [lowerB, upperB] = [] } = this.state;

    if (lowerB < min) {
      this.setState({ intentLow: Intent.DANGER });
    }

    if (upperB > max) {
      this.setState({ intentUp: Intent.DANGER });
    }

    if (lowerB > upperB) {
      this.setState({ intentUp: Intent.DANGER, intentLow: Intent.DANGER });
    }

    if (lowerB <= upperB && lowerB >= min && upperB <= max) {
      this.setState({ intentLow: undefined, intentUp: undefined });
      if (lowerB === min && upperB === max) {
        this.onChangeDebounced(undefined);
      } else {
        this.onChangeDebounced([lowerB, upperB]);
      }
    }
  };

  render () {
    const { translate, ...props } = this.props;
    const { intentLow, intentUp, range: [lowerBound, upperBound] } = this.state;

    const inputProps = {
      selectAllOnFocus: true,
      clampValueOnBlur: true,
      buttonPosition: 'none',
      ...sanitizeProps(props),
    };

    return (
      <div className="control--range__numeric">
        <FormGroup
          className="bp3-inline"
          label={translate('terralego.forms.controls.range_from')}
        >
          <NumericInput
            {...inputProps}
            intent={intentLow}
            onValueChange={this.onNumericInputChange(0)}
            value={lowerBound}
          />
        </FormGroup>
        <FormGroup
          className="bp3-inline"
          label={translate('terralego.forms.controls.range_to')}
        >
          <NumericInput
            {...inputProps}
            intent={intentUp}
            onValueChange={this.onNumericInputChange(1)}
            value={upperBound}
          />
        </FormGroup>
      </div>
    );
  }
}

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
