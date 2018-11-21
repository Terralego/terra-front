import React from 'react';
import PropTypes from 'prop-types';
import { Card, H4 } from '@blueprintjs/core';

// import GroupNode from './GroupNode/GroupNode';
import LayerNode from './LayerNode/LayerNode';
import './styles.scss';


const onChange = (label, visible) =>
  console.log(label, visible);

const LayersTree = ({ layers }) => (
  <Card
    className="layersTreePanelContainer bp3-dark"
  >
    <H4>Couches cartographique</H4>
    { layers.map(layer => (
      <LayerNode
        key={layer.id}
        label={layer.layer}
        onChange={onChange}
      />
    ))
    }
  </Card>
);

LayersTree.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    // layers: PropTypes.array, // recursif
  })),
};

LayersTree.defaultProps = {
  layers: [],
};

export default LayersTree;
