import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@blueprintjs/core';
import translateMock from '../../../../../utils/translate';

import './styles.scss';

function getLabelFromType (label, type, translate) {
  if (!label) {
    return null;
  }
  if (type !== 'boolean') {
    return translate('terralego.visualizer.layerstree.itemFilters.label', { label });
  }
  return label;
}

export function getValueFromType (value, type, translate) {
  const isDate = val => val instanceof Date;
  const nameSpace = 'terralego.visualizer.layerstree.itemFilters';

  if (type === 'boolean') {
    return null;
  }

  if (type === 'many') {
    return value.join(', ');
  }

  if (isDate(value)) {
    return translate(`${nameSpace}.date`, { value: value.toLocaleDateString() });
  }

  if (type !== 'range') {
    return value;
  }

  const [from, to] = value;

  if (from === null && to === null) {
    return null;
  }

  if (!isDate(from) && !isDate(to)) {
    return translate(`${nameSpace}.range.numeric`, { from, to });
  }

  if (from && to) {
    return translate(`${nameSpace}.range.date`, { from: from.toLocaleDateString(), to: to.toLocaleDateString() });
  }

  if (!from) {
    return translate(`${nameSpace}.range.dateEnding`, { to: to.toLocaleDateString() });
  }

  return translate(`${nameSpace}.range.dateStarting`, { from: from.toLocaleDateString() });
}

const LayersTreeItemFilters = ({
  filtersValues,
  setLayerState,
  layer,
  layer: { filters: { form: layerForm } = {} },
  activeLayer: { filters: { form = layerForm } = {} },
  translate,
}) => {
  const properties = useMemo(() =>
    (form || []).map(({ property, ...rest }) => ({
      ...rest,
      property,
      value: filtersValues[property],
    })),
  [filtersValues, form]);

  const propertiesHasValue = useMemo(() => (
    properties.some(({ value }) => (
      Array.isArray(value) ? value.some(rangeItem => rangeItem) : value
    ))
  ),
  [properties]);

  if (!propertiesHasValue) {
    return null;
  }

  return (
    <div className="layersTreeItemFilter">
      {properties.map(({ property, value, type, label }) => (
        value && (
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
            {getLabelFromType(label, type, translate)}
            {getValueFromType(value, type, translate)}
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
  translate: translateMock({
    'terralego.visualizer.layerstree.itemFilters.date': '{{value}}',
    'terralego.visualizer.layerstree.itemFilters.label': '{{label}}: ',
    'terralego.visualizer.layerstree.itemFilters.range.date': 'Starting from {{from}} to {{to}}',
    'terralego.visualizer.layerstree.itemFilters.range.dateStarting': 'Starting from {{from}}',
    'terralego.visualizer.layerstree.itemFilters.range.dateEnding': 'Ending by {{to}}',
    'terralego.visualizer.layerstree.itemFilters.range.numeric': 'Between {{from}} and {{to}}',
  }),
};

export default LayersTreeItemFilters;
