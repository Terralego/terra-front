import React from 'react';

import Radios from '../../../../Forms/Controls/Radios';
import Select from '../../../../Forms/Controls/Select';


export class LayersTreeSubItemsList extends React.Component {
  onSelectionChange = ({ target: { value: sublayer } }) => {
    const { layer, selectSublayer } = this.props;

    selectSublayer({ layer, sublayer: +sublayer });
  }

  onSelectionChangeWithSelect = sublayerindex => {
    const { layer, selectSublayer } = this.props;
    selectSublayer({
      layer,
      sublayer: sublayerindex,
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

    return (
      <div className="layers-tree-subitems-list">
        {sublayers.length <= 5
          ? (
            <Radios
              onSelectionChange={onSelectionChange}
              selectedValue={selectedValue}
              sublayers={sublayers}
            />
          ) : (
            <Select
              label=""
              onChange={this.onSelectionChangeWithSelect}
              values={sublayers.map(({ label }, value) => ({
                label,
                value,
              }))}
              placeholder="Selectionner une variable"
              value={sublayers[selectedValue].label || 'Selectionner une variable'}
            />
          )
        }
      </div>
    );
  }
}

export default LayersTreeSubItemsList;
