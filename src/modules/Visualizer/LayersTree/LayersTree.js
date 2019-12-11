import React from 'react';
import PropTypes from 'prop-types';

import LayersTreeGroup from './LayersTreeGroup';
import LayersTreeItem from './LayersTreeItem';
import LayerProps from '../types/Layer';

import './styles.scss';

export const LayersTree = ({ layersTree }) => (
  <div className="layerstree-panel-list">
    {layersTree.map((layer, index) => {
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

      return (
        <LayersTreeItem
          key={layer.label || layer.group}
          layer={layer}
        />
      );
    })}
  </div>
);
LayersTree.propTypes = {
  layersTree: PropTypes.arrayOf(PropTypes.oneOfType([
    LayerProps,
    PropTypes.shape({
      group: PropTypes.string,
      layers: PropTypes.arrayOf(LayerProps),
    }),
  ])).isRequired,
};

export default LayersTree;
