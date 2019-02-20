import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@blueprintjs/core';

import './index.scss';

export class Checkboxes extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
  }

  static defaultProps = {
    label: '',
    values: [],
    onChange: () => null,
  }

  state = {
    values: [],
  }

  handleChange = value => async () => {
    const { onChange } = this.props;
    const { values } = this.state;
    await this.setState({
      values: values.includes(value)
        ? [...values.filter(val => val !== value)]
        : [...values, value],
    });
    // eslint-disable-next-line
    onChange(this.state.values);
  }

  render () {
    const { label, values: valuesProperties } = this.props;
    const { handleChange } = this;

    return (
      <div className="control-container">
        <p className="control-label">{label}</p>
        {valuesProperties.map(val =>
          <Checkbox key={val} onChange={handleChange(val)} label={val} />)}
      </div>
    );
  }
}

export default Checkboxes;
