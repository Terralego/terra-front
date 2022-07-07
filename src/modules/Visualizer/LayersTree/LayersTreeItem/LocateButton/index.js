import React, { useCallback, useEffect, useState } from 'react';
import bbox from '@turf/bbox';
import { Button, Position } from '@blueprintjs/core';
import debounce from 'lodash.debounce';
import Tooltip from '../../../../../components/Tooltip';
import translateMock from '../../../../../utils/translate';

const LocateButton = ({
  layer,
  map,
  isTablet,
  translate = translateMock({
    'terralego.visualizer.layerstree.itemOptions.locate.text': 'Extent this layer',
  }),
}) => {
  const [features, setFeatures] = useState([]);

  const getFeatures = useCallback(() => {
    if (!map) {
      return [];
    }
    const { type, source, sourceLayer, id } = map.getLayer(layer.layers[0]) || {};
    if (['raster', undefined].includes(type)) {
      return [];
    }
    return map.querySourceFeatures(source, {
      sourceLayer,
      filter: map.getFilter([id]),
    });
  }, [layer.layers, map]);

  const handleFeatures = useCallback(debounce(() => {
    setFeatures(getFeatures());
  }, 200), [getFeatures]);

  useEffect(() => {
    if (map) {
      map.once('idle', handleFeatures);
      map.on('zoomend', handleFeatures);
      window.addEventListener('resize', handleFeatures);
    }
    return () => {
      map && map.off('zoomend', handleFeatures);
      window.removeEventListener('resize', handleFeatures);
    };
  }, [handleFeatures, map]);

  if (!map) {
    return null;
  }

  const { type } = map.getLayer(layer.layers[0]) || {};

  if (['raster', undefined].includes(type) || features.length === 0) {
    return null;
  }

  const onClick = () => {
    map.fitBounds(bbox({ type: 'FeatureCollection', features }), { padding: 10 });
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
