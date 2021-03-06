import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@blueprintjs/core';

import Checkbox from './Checkbox';
import formatValues from '../formatValues';
import NoValues from '../NoValues';
import translateMock from '../../../../utils/translate';

import '../index.scss';

export class Checkboxes extends React.Component {
  static getDerivedStateFromProps ({ values }) {
    if (!values) return null;

    return {
      values: formatValues(values),
    };
  }

  static propTypes = {
    translate: PropTypes.func,
  };

  static defaultProps = {
    translate: translateMock({
      'terralego.forms.controls.noValues': 'No choice available',
    }),
  };

  state = {}

  onToggle = toggledValue => {
    const { value, onChange } = this.props;

    const newValue = value.includes(toggledValue)
      ? [...value.filter(val => val !== toggledValue)]
      : [...value, toggledValue];

    if (newValue.length === 0) { // Case where we have selected nothing
      onChange();
    } else {
      onChange(newValue);
    }
  }

  render () {
    const { value: mainValue, label: mainLabel, loading, translate } = this.props;
    const { values } = this.state;
    const { onToggle } = this;

    return (
      <div className="control-container">
        <p className="control-label">{mainLabel}</p>
        {loading && <Spinner size={20} />}
        {!loading && !values.length && <NoValues placeholder={translate('terralego.forms.controls.noValues')} />}
        {!loading && values.map(({ label, value }) => (
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
  loading: PropTypes.bool,
};

Checkboxes.defaultProps = {
  label: '',
  value: [],
  values: [],
  onChange () {},
  loading: false,
};

export default Checkboxes;
