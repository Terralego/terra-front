import React from 'react';
import PropTypes from 'prop-types';

import { RadioGroup, Radio } from '@blueprintjs/core';
import formatValues from './formatValues';

export class Radios extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    // Prop is used in getDerivedStateFromProps
    // eslint-disable-next-line react/no-unused-prop-types
    values: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
        }),
      ]),
    ).isRequired,
    // value may take any value type
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
  };

  static defaultProps = {
    onChange () {},
    value: 0,
  };

  static getDerivedStateFromProps ({ values }) {
    if (!values) return null;

    return {
      values: formatValues(values),
    };
  }

  state = {
    values: [],
  }

  handleChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    onChange(value);
  };

  render () {
    const { value, className = '' } = this.props;
    const { values } = this.state;

    return (
      <RadioGroup
        className={`control-container ${className}`}
        onChange={this.handleChange}
        selectedValue={value}
      >
        {values.map(({ label }, k) => (
          <Radio
            key={label}
            label={label}
            value={k}
          />
        ))}
      </RadioGroup>
    );
  }
}

export default Radios;
