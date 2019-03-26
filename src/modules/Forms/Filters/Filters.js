import React from 'react';
import PropTypes from 'prop-types';

import Select from '../Controls/Select';
import Text from '../Controls/Text';
import Checkboxes from '../Controls/Checkboxes';
import Range from '../Controls/Range';
import Switch from '../Controls/Switch';
import MultiSelect from '../Controls/MultiSelect';
import DateRangeInput from '../Controls/DateRangeInput';

export const TYPE_SINGLE = 'single';
export const TYPE_MANY = 'many';
export const TYPE_RANGE = 'range';
export const TYPE_BOOL = 'boolean';
export const TYPE_DATE_RANGE = 'date-range';

const DEFAULT_LOCALES = {
  noResults: 'No results',
  emptySelectItem: 'Nothing',
};


export function getComponent (type, values, display) {
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
      return Range;
    case TYPE_BOOL:
      return Switch;
    case TYPE_DATE_RANGE:
      return DateRangeInput;
    default:
      return null;
  }
}

export class Filters extends React.Component {
  static propTypes = {
    locales: PropTypes.shape({
      noResults: PropTypes.string,
    }),
    onChange: PropTypes.func,
    layer: PropTypes.string,
    filters: PropTypes.arrayOf(PropTypes.shape({
      property: PropTypes.string.isRequired,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      type: PropTypes.oneOf([TYPE_SINGLE, TYPE_MANY, TYPE_RANGE, TYPE_BOOL, TYPE_DATE_RANGE]).isRequired,
      values: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.bool,
      ]),
    })),
    properties: PropTypes.shape({
      // property: value
    }),
  };

  static defaultProps = {
    locales: {},
    onChange () {},
    filters: [],
    properties: {},
    layer: '',
  };

  onChange = property => value => {
    const { onChange, properties } = this.props;
    onChange({ ...properties, [property]: value });
  };

  render () {
    const { onChange } = this;
    const { properties, filters, locales: customLocales } = this.props;
    const locales = { ...DEFAULT_LOCALES, ...customLocales };

    return (
      <div>
        {filters.map(({ type, values, property, display, ...props }) => {
          const Component = getComponent(type, values, display);

          return (
            <Component
              {...props}
              key={property}
              type={type}
              values={values}
              property={property}
              onChange={onChange(property)}
              locales={locales}
              value={properties[property]}
            />
          );
        })}
      </div>
    );
  }
}

export default Filters;
