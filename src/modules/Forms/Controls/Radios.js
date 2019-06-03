import React from 'react';
import PropTypes from 'prop-types';

import { RadioGroup, Radio } from '@blueprintjs/core';

export class Radios extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
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

  handleChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    onChange(value);
  };

  render () {
    const {
      values,
      value,
    } = this.props;

    return (
      <RadioGroup
        className="control-container"
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
