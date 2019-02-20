import React from 'react';
import { Checkbox } from '@blueprintjs/core';

import './index.scss';

export class Checkboxes extends React.Component {
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
