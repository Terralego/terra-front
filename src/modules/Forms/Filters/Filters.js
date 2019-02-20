import React from 'react';
import PropTypes from 'prop-types';

import Select from '../Controls/Select';
import Text from '../Controls/Text';
import Checkboxes from '../Controls/Checkboxes';

function getComponent (type, values) {
  switch (type) {
    case 'single':
      return Array.isArray(values)
        ? Select
        : Text;
    case 'many':
      return Checkboxes;
    default:
      return null;
  }
}

export class Filters extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    layer: PropTypes.string,
    properties: PropTypes.arrayOf(PropTypes.shape({
      property: PropTypes.string.isRequired,
      label: PropTypes.string,
      placeholder: PropTypes.string,

      type: PropTypes.oneOf(['single', 'many', 'range']).isRequired,
      values: PropTypes.arrayOf(PropTypes.string),
    })),
  }

  static defaultProps = {
    onChange: () => null,
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
    const { properties: propertiesSchema } = this.props;
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
