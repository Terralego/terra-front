import React from 'react';
import { Button, Position } from '@blueprintjs/core';
import Tooltip from '../../../../../components/Tooltip';
import translateMock from '../../../../../utils/translate';

const LocateButton = ({
  layer,
  map,
  isTablet,
  extent,
  translate = translateMock({
    'terralego.visualizer.layerstree.itemOptions.locate.text': 'Extent this layer',
  }),
}) => {
  if (!map || !extent) {
    return null;
  }

  const { type } = map.getLayer(layer.layers[0]) || {};

  if (['raster', undefined].includes(type)) {
    return null;
  }

  const onClick = () => {
    map.fitBounds(extent, { padding: 10 });
  };

  return (
    <Tooltip
      className="layerstree-node-content__options__tooltip locate"
      content={translate('terralego.visualizer.layerstree.itemOptions.locate.text')}
      position={Position.TOP}
    >
      <Button
        className="layerstree-node-content__options__button"
        minimal
        icon="zoom-to-fit"
        onClick={onClick}
        text={isTablet && translate('terralego.visualizer.layerstree.itemOptions.locate.text')}
      />
    </Tooltip>
  );
};

export default LocateButton;
