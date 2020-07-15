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
    if (Number.isNaN(+bound)) return; // Sanity check that allows typing '-'

    this.setState(({ range: prevRange }) => {
      const nextRange = [...prevRange];
      nextRange[pos] = bound;

      // this need to be done here, setState is async
      const { intentLow, intentUp } = this.rangeValidator(nextRange);
      return { range: nextRange, intentLow, intentUp };
    });
  }

  rangeValidator = range => {
    // Check that the values are within min/max, it will be eventually be
    // clamped, but we need to prevent firing onChange
    const { min, max } = this.props;
    const [lowerB, upperB] = range;
    const intent = {};
    if (lowerB > upperB) {
      intent.intentLow = Intent.DANGER;
      intent.intentUp = Intent.DANGER;
    }

    if (lowerB <= upperB) {
      intent.intentLow = undefined;
      intent.intentUp = undefined;
      if (lowerB === min && upperB === max) {
        this.onChangeDebounced(undefined);
      } else {
        this.onChangeDebounced([lowerB, upperB]);
      }
    }
    return intent;
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
