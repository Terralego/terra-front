import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from './Checkbox';
import formatValues from '../formatValues';
import '../index.scss';

export class Checkboxes extends React.Component {
  static getDerivedStateFromProps ({ values }) {
    if (!values) return null;

    return {
      values: formatValues(values),
    };
  }

  onToggle = toggledValue => {
    const { value, onChange } = this.props;
    const newValue = value.includes(toggledValue)
      ? [...value.filter(val => val !== toggledValue)]
      : [...value, toggledValue];
    onChange(newValue);
  }

  render () {
    const { value: mainValue, label: mainLabel } = this.props;
    const { values } = this.state;
    const { onToggle } = this;

    return (
      <div className="control-container">
        <p className="control-label">{mainLabel}</p>
        {values.map(({ label, value }) => (
          <Checkbox
            key={`${label}${value}`}
            onToggle={onToggle}
            value={value}
            label={label}
            checked={mainValue.includes(value)}
          />
        ))}
      </div>
    );
  }
}


Checkboxes.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  // Prop is used in getDerivedStateFromProps
  // eslint-disable-next-line react/no-unused-prop-types
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
