import React from 'react';

import Radios from '../../../../Forms/Controls/Radios';
import Select from '../../../../Forms/Controls/Select';


export class LayersTreeSubItemsList extends React.Component {
  onSelectionChange = sublayerindex => {
    const { layer, selectSublayer } = this.props;

    selectSublayer({
      layer,
      sublayer: +sublayerindex,
    });
  }


  render () {
    const {
      sublayers,
      layerState,
    } = this.props;

    const { onSelectionChange } = this;

    const selectedValue = layerState.sublayers.reduce((sublayersValue, selected, k) =>
      ((sublayersValue === undefined || selected)
        ? +k
        : sublayersValue), undefined);
    const lotOfItems = sublayers.length > 5;
    const Component = lotOfItems ? Select : Radios;
    const value = lotOfItems
      ? sublayers[selectedValue].label
      : selectedValue;

    return (
      <Component
        className="layerstree-subitems-list"
        onChange={onSelectionChange}
        values={sublayers.map(({ label }, index) => ({
          label,
          value: index,
        }))}
        value={value}
      />
    );
  }
}

export default LayersTreeSubItemsList;
