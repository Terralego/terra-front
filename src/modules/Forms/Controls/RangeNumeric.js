import React from 'react';
import PropTypes from 'prop-types';
import { NumericInput, FormGroup, Intent } from '@blueprintjs/core';
import translateMock from '../../../utils/translate';
import { DEFAULT_MIN, DEFAULT_MAX } from './Range';
import RangeComponent from './RangeComponent';

/**
 * Two numeric inputs for editing a range.
 */
class RangeNumeric extends RangeComponent {
  onNumericInputChange = pos => bound => {
    const { onChange, min, max } = this.props;
    const { range } = this.state;
    if (Number.isNaN(+bound)) return; // Sanity check that allows typing '-'
    range[pos] = bound;
    this.setState({ range });

    // Check that the values are within min/max, it will be eventually be
    // clamped, but we need to prevent firing onChange
    const [lowerB, upperB] = range;
    if (lowerB <= upperB && min <= lowerB && upperB <= max) {
      this.setState({ intent: undefined });
      onChange(range);
    } else {
      this.setState({ intent: Intent.DANGER });
    }
  };

  render () {
    const { onChange, translate, ...props } = this.props;
    const { intent, range: [lowerBound, upperBound] } = this.state;

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
