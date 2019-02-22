import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from './Checkbox';

import '../index.scss';

export class Checkboxes extends React.Component {
  onToggle = toggledValue => {
    const { value, onChange } = this.props;
    const newValue = value.includes(toggledValue)
      ? [...value.filter(val => val !== toggledValue)]
      : [...value, toggledValue];
    onChange(newValue);
  }

  render () {
    const { values, value, label } = this.props;
    const { onToggle } = this;

    return (
      <div className="control-container">
        <p className="control-label">{label}</p>
        {values.map(val =>
          <Checkbox key={val} onToggle={onToggle} value={val} checked={value.includes(val)} />)}
      </div>
    );
  }
}


Checkboxes.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  values: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

Checkboxes.defaultProps = {
  label: '',
  value: [],
  values: [],
  onChange () {},
};

export default Checkboxes;
