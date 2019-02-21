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
    onChange () {},
  }

  state = {
    values: [],
  }

  handleChange = value => () => {
    const { onChange } = this.props;
    this.setState(({ values: prevValues }) => {
      const values = prevValues.includes(value)
        ? [...prevValues.filter(val => val !== value)]
        : [...prevValues, value];
      onChange(values);
      return value;
    });
  }

  render () {
    const { label, values } = this.props;
    const { handleChange } = this;

    return (
      <div className="control-container">
        <p className="control-label">{label}</p>
        {values.map(val =>
          <Checkbox key={val} onChange={handleChange(val)} label={val} />)}
      </div>
    );
  }
}

export default Checkboxes;
