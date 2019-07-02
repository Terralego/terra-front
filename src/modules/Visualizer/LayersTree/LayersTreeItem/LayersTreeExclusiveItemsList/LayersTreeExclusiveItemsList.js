import React from 'react';

import Radios from '../../../../Forms/Controls/Radios';
import Select from '../../../../Forms/Controls/Select';


export const LayersTreeExclusiveItemsList = ({
  layer: { layers },
  selected = 0,
  onChange,
}) => {
  const lotOfItems = layers.length > 5;
  const Component = lotOfItems ? Select : Radios;
  const value = lotOfItems
    ? layers[selected].label
    : selected;

  return (
    <Component
      className="layerstree-subitems-list"
      onChange={onChange}
      values={layers.filter(({ label }) => label).map(({ label }, index) => ({
        label,
        value: index,
      }))}
      value={value}
    />
  );
};

export default LayersTreeExclusiveItemsList;
