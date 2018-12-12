import React from 'react';
import { RadioGroup, Radio } from '@blueprintjs/core';

export class LayersTreeSubItemsList extends React.Component {
  onSelectionChange = ({ target: { value: sublayer } }) => {
    const { layer, selectSublayer } = this.props;

    selectSublayer({ layer, sublayer: +sublayer });
  }

  render () {
    const { sublayers, layerState } = this.props;
    const { onSelectionChange } = this;
    const selectedValue = layerState.sublayers.reduce((value, selected, k) =>
      ((value === undefined || selected)
        ? +k
        : value), undefined);

    return (
      <div className="layers-tree-subitems-list">
        <RadioGroup
          onChange={onSelectionChange}
          selectedValue={selectedValue}
        >
          {sublayers.map((sublayer, k) => (
            <Radio
              key={sublayer.label}
              label={sublayer.label}
              value={k}
            />
          ))}
        </RadioGroup>
      </div>
    );
  }
}

export default LayersTreeSubItemsList;
