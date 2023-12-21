import PropTypes from 'prop-types';
import React, { useState } from 'react';

import SearchInput from '../../Map/Map/components/SearchControl/SearchInput';
import LayerProps from '../types/Layer';
import LayersTreeGroup from './LayersTreeGroup';
import LayersTreeItem from './LayersTreeItem';

import translateMock from '../../../utils/translate';

import LayersTreeVariableItem from './LayersTreeItem/LayersTreeVariableItem';
import './styles.scss';

const filterLayers = (layers, searchQuery) =>
  layers
    .map(layer => {
      if (layer.group) {
        if (layer.group.toLowerCase().includes(searchQuery.toLowerCase())) return layer;

        // Filter layer groups
        const filteredLayers = filterLayers(layer.layers, searchQuery);

        const filteredGroup = {
          ...layer,
          layers: filteredLayers,
        };

        // Return the filtered group only if it matches the search query or has filtered layers
        return filteredGroup.layers.length > 0 ? filteredGroup : null;
      }
      // Return the layer only if it matches the search query
      return layer.label.toLowerCase().includes(searchQuery.toLowerCase()) ? layer : null;
    })
    .filter(Boolean);

export const LayersTree = ({ layersTree, translate, filterable }) => {
  const [layersTreeFilter, setLayerTreeFilter] = useState('');

  const filteredLayersTree = filterable ? filterLayers(layersTree, layersTreeFilter) : layersTree;

  return (
    <div className="layerstree-panel-list">
      {filterable && (
        <SearchInput
          placeholder={translate('terralego.visualizer.layerstree.list.filter')}
          onChange={e => setLayerTreeFilter(e.target.value)}
          query={layersTreeFilter}
          onClose={() => setLayerTreeFilter('')}
        />
      )}
      {filteredLayersTree.map((layer, index) => {
        if (layer.group && !layer.exclusive) {
          return (
            <LayersTreeGroup
              // Done to avoid duplicate warning on same label
              key={index} // eslint-disable-line react/no-array-index-key
              title={layer.group}
              layer={layer}
            />
          );
        }

        return layer.exclusive && layer.byVariable ? (
          <LayersTreeVariableItem layers={layer.layers} group={layer} />
        ) : (
          <LayersTreeItem key={layer.label || layer.group} layer={layer} />
        );
      })}
    </div>
  );
};
LayersTree.propTypes = {
  layersTree: PropTypes.arrayOf(
    PropTypes.oneOfType([
      LayerProps,
      PropTypes.shape({
        group: PropTypes.string,
        layers: PropTypes.arrayOf(LayerProps),
      }),
    ]),
  ).isRequired,
  translate: PropTypes.func,
  filterable: PropTypes.bool,
};
LayersTree.defaultProps = {
  filterable: false,
  translate: translateMock({
    'terralego.visualizer.layerstree.list.filter': 'Filter layers',
  }),
};

export default LayersTree;
