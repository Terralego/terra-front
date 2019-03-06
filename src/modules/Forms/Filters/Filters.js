import React from 'react';
import PropTypes from 'prop-types';

import Select from '../Controls/Select';
import Text from '../Controls/Text';
import Checkboxes from '../Controls/Checkboxes';
import Range from '../Controls/Range';
import Switch from '../Controls/Switch';

export const TYPE_SINGLE = 'single';
export const TYPE_MANY = 'many';
export const TYPE_RANGE = 'range';
export const TYPE_BOOL = 'boolean';

const DEFAULT_LOCALES = {
  noResults: 'No results',
  emptySelectItem: 'Nothing',
};

export function getComponent (type, values) {
  switch (type) {
    case TYPE_SINGLE:
      return Array.isArray(values)
        ? Select
        : Text;
    case TYPE_MANY:
      return Checkboxes;
    case TYPE_RANGE:
      return Range;
    case TYPE_BOOL:
      return Switch;
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
      type: PropTypes.oneOf([TYPE_SINGLE, TYPE_MANY, TYPE_RANGE, TYPE_BOOL]).isRequired,
      values: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.bool,
      ]),
    })),
    properties: PropTypes.shape({
      // property: value
    }),
  }

  static defaultProps = {
    locales: {},
    onChange () {},
    filters: [],
    properties: {},
    layer: '',
  }

  onChange = property => value => {
    const { onChange, properties } = this.props;
    onChange({ ...properties, [property]: value });
  }

  render () {
    const { onChange } = this;
    const { properties, filters, locales: customLocales } = this.props;
    const locales = { ...DEFAULT_LOCALES, ...customLocales };

    return (
      <div>
        {filters.map(({ type, values, property, ...props }) => {
          const Component = getComponent(type, values);

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
