import React from 'react';
import PropTypes from 'prop-types';

import Spinner from '@blueprintjs/core';

import Select from '../Controls/Select';
import Text from '../Controls/Text';
import Checkboxes from '../Controls/Checkboxes';
import Range from '../Controls/Range';
import Switch from '../Controls/Switch';
import MultiSelect from '../Controls/MultiSelect';
import DateRangeInput from '../Controls/DateRangeInput';
import Control from './Control';
import translateMock from '../../../utils/translate';
import NoValues from '../Controls/NoValues';

export const TYPE_SINGLE = 'single';
export const TYPE_MANY = 'many';
export const TYPE_RANGE = 'range';
export const TYPE_BOOL = 'boolean';

export function getComponent (type, values, display, format) {
  switch (type) {
    case TYPE_SINGLE:
      return Array.isArray(values)
        ? Select
        : Text;
    case TYPE_MANY:
      return (
        Array.isArray(values) && values.length > 10) ||
          (display === 'select')
        ? MultiSelect
        : Checkboxes;
    case TYPE_RANGE:
      return format === 'date'
        ? DateRangeInput
        : Range;
    case TYPE_BOOL:
      return Switch;
    default:
      return null;
  }
}

export const Filters = ({ properties, filters, translate, onChange, loading }) => (
  <div>
    {filters.map(({ type, values, property, display, format, label, ...props }) => {
      console.log(!!loading);
      if (loading && !values) {
        return <Spinner size={20} />;
      } if (values && values.length === 0) {
        return <NoValues label={label} />;
      }
      return (
        <Control
          {...props}
          label={label}
          translate={translate}
          component={getComponent(type, values, display, format)}
          key={property}
          type={type}
          values={values}
          property={property}
          onChange={value => onChange({ ...properties, [property]: value })}
          value={properties[property]}
        />
      );
    })}
  </div>
);

Filters.propTypes = {
  onChange: PropTypes.func,
  filters: PropTypes.arrayOf(PropTypes.shape({
    property: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.oneOf([
      TYPE_SINGLE,
      TYPE_MANY,
      TYPE_RANGE,
      TYPE_BOOL,
    ]).isRequired,
    values: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })),
    ]),

  })),
  properties: PropTypes.shape({
    // property: value
  }),
  translate: PropTypes.func,
  loading: PropTypes.bool,
};

Filters.defaultProps = {
  onChange () {},
  filters: [],
  properties: {},
  translate: translateMock(),
  loading: false,
};

export default Filters;
