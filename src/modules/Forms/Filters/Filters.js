import React from 'react';
import PropTypes from 'prop-types';

import Select from '../Controls/Select';
import Text from '../Controls/Text';
import Checkboxes from '../Controls/Checkboxes';

export const TYPE_SINGLE = 'single';
export const TYPE_MANY = 'many';
export const TYPE_RANGE = 'range';

const DEFAULT_LOCALES = {
  noResults: 'No results',
};

function getComponent (type, values) {
  switch (type) {
    case TYPE_SINGLE:
      return Array.isArray(values)
        ? Select
        : Text;
    case TYPE_MANY:
      return Checkboxes;
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
    properties: PropTypes.arrayOf(PropTypes.shape({
      property: PropTypes.string.isRequired,
      label: PropTypes.string,
      placeholder: PropTypes.string,

      type: PropTypes.oneOf([TYPE_SINGLE, TYPE_MANY, TYPE_RANGE]).isRequired,
      values: PropTypes.arrayOf(PropTypes.string),
    })),
  }

  static defaultProps = {
    locales: {},
    onChange () {},
    properties: [],
    layer: '',
  }

  state = {
    filters: [],
    properties: {},
  }

  componentDidMount () {
    this.generateFilters();
  }

  onChange = property => value => {
    const { onChange } = this.props;
    this.setState(({ properties: prevProperties }) => {
      const properties = {
        ...prevProperties,
        [property]: value,
      };
      onChange(properties);
      return { properties };
    });
  }

  generateFilters () {
    const { properties: propertiesSchema, locales: customLocales } = this.props;
    const locales = { ...DEFAULT_LOCALES, ...customLocales };
    const filters = propertiesSchema.map(({ type, values, property, ...props }) => {
      const Component = getComponent(type, values);
      const { properties } = this.state;

      if (!Component) return null;


      return (
        <Component
          key={property}
          type={type}
          values={values}
          property={property}
          onChange={this.onChange(property)}
          value={properties[property] || ''}
          locales={locales}
          {...props}
        />
      );
    });
    this.setState({ filters });
  }

  render () {
    const { filters } = this.state;

    return (
      <div>
        {filters}
      </div>
    );
  }
}

export default Filters;
