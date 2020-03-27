import React from 'react';

import Radios from '../../../../Forms/Controls/Radios';
import Select from '../../../../Forms/Controls/Select';
import Selector from './Selector';

const MAX_ITEMS_AS_RADIO = 5;
const getComponent = (selectors, itemsLength) => {
  if (selectors) return Selector;
  return itemsLength > MAX_ITEMS_AS_RADIO ? Select : Radios;
};

export const LayersTreeExclusiveItemsList = ({
  layer,
  layer: { layers, selectors },
  selected = 0,
  onChange,
}) => {
  const lotOfItems = layers.length > 5;
  const Component = getComponent(selectors, layers.length);
  const values = layers.filter(({ label }) => label).map(({ label }, index) => ({
    label,
    value: index,
  }));
  const value = lotOfItems
    ? values.find(({ value: itemValue }) => itemValue === selected).value
    : selected;

  return (
    <Component
      fullWidth
      layer={layer}
      className="layerstree-node-content__subitems-list"
      onChange={onChange}
      values={values}
      value={value}
    />
  );
};

export default LayersTreeExclusiveItemsList;
