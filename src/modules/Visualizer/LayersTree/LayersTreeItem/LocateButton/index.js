import React from 'react';
import { Button, Position } from '@blueprintjs/core';
import Tooltip from '../../../../../components/Tooltip';
import translateMock from '../../../../../utils/translate';

const LocateButton = ({
  layer,
  map,
  isTablet,
  extent,
  isTableActive,
  isDetailsVisible,
  hasActiveWidget,
  translate = translateMock({
    'terralego.visualizer.layerstree.itemOptions.locate.text': 'Extent this layer',
  }),
}) => {
  const padding = React.useMemo(() => {
    // The purpose of the lines below is to add some padding to the map.fitBounds.
    // When a panel is unfold (Widget, LayersTree, DataTable, etc..), the map is not resized
    // but just covered by those elements.
    // The idea is to add padding according to the size of the element covering the map
    // so the fitBounds will let all the features visible by the user
    // (and not have some covered by panels).

    // Add 10px to each padding value to give some space
    const offset = 10;


    // LayersTree, Widget & Details panel have fixed sized
    // so we just add "raw" padding
    const layersTreePadding = 312;
    const widgetPadding = 330;
    const detailsPadding = 400;

    // -33vh from DataTable
    const dataTablePadding = window.innerHeight / 3;

    const paddingEntries = ['top', 'bottom', 'left', 'right'].map(side => [side, offset]);
    const paddingValues = Object.fromEntries(paddingEntries);

    // LayersTree panel has to be opened to click on the LocateButton
    paddingValues.left += layersTreePadding;

    if (isTableActive) {
      paddingValues.bottom += dataTablePadding;
    }

    if (hasActiveWidget) {
      paddingValues.right += widgetPadding;
    }

    if (isDetailsVisible) {
      paddingValues.right += detailsPadding;
    }

    return paddingValues;
  }, [isDetailsVisible, isTableActive, hasActiveWidget]);

  if (!map || !extent) {
    return null;
  }

  const { type } = map.getLayer(layer.layers[0]) || {};

  if (['raster', undefined].includes(type)) {
    return null;
  }

  const onClick = () => {
    map.fitBounds(extent, { padding });
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
