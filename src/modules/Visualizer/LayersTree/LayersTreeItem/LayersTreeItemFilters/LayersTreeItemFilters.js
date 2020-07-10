import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@blueprintjs/core';

import './styles.scss';

function getLiteralValue (value) {
  if (value instanceof Date) {
    return `le ${value.toLocaleDateString()}`;
  }
  return value;
}

export function getValueFromType (value, type) {
  if (type === 'boolean') {
    return null;
  }
  if (type === 'range') {
    return `: Entre ${getLiteralValue(value[0])} et ${getLiteralValue(value[1])}`;
  }
  return `: ${getLiteralValue(value)}`;
}

const LayersTreeItemFilters = ({
  filtersValues,
  setLayerState,
  layer,
  layer: { filters: { form: layerForm } = {} },
  activeLayer: { filters: { form = layerForm } = {} },
}) => {
  const properties = useMemo(() =>
    (form || []).map(({ property, ...rest }) => ({
      ...rest,
      property,
      value: filtersValues[property],
    })),
  [filtersValues, form]);

  if (!properties.some(({ value }) => value)) {
    return null;
  }

  return (
    <div className="layersTreeItemFilter">
      {properties.map(({ property, value, type, label }) => (
        (value && value.length > 0) && (
        <Tag
          key={property}
          className="layersTreeItemFilter__tag"
          onRemove={() =>
            setLayerState({
              layer,
              state: {
                filters: { ...filtersValues, [property]: undefined },
                total: undefined,
              },
            })}
        >
          {label}
          {getValueFromType(value, type)}
        </Tag>
        )
      ))}
    </div>
  );
};

LayersTreeItemFilters.propTypes = {
  filtersValues: PropTypes.shape({}),
  setLayerState: PropTypes.func,
  layer: PropTypes.shape({
    filters: PropTypes.shape({
      form: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          property: PropTypes.string,
          type: PropTypes.string,
        }),
      ),
    }),
  }),
  activeLayer: PropTypes.shape({
    filters: PropTypes.shape({
      form: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          property: PropTypes.string,
          type: PropTypes.string,
        }),
      ),
    }),
  }),
  translate: PropTypes.func,
};

LayersTreeItemFilters.defaultProps = {
  filtersValues: {},
  setLayerState: () => {},
  layer: {
    filters: {
      form: undefined,
    },
  },
  activeLayer: {
    filters: {
      form: undefined,
    },
  },
};

export default LayersTreeItemFilters;
