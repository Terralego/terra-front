import React from 'react';
import { Button, Card, Switch, Elevation } from '@blueprintjs/core';

import LayersTreeSubItemsList from '../LayersTreeSubItemsList';
import OptionsLayer from '../OptionsLayer';

export class LayersTreeItem extends React.Component {
  state = {
    isOptionsOpen: false,
  }

  onActiveChange = ({ target: { checked: active } }) => {
    const { layer, setLayerState } = this.props;
    setLayerState({ layer, state: { active } });
  }

  onOpacityChange = opacity => {
    const { layer, setLayerState } = this.props;
    setLayerState({ layer, state: { opacity } });
  }

  handleOptionPanel = () => {
    const { isOptionsOpen } = this.state;
    this.setState({ isOptionsOpen: !isOptionsOpen });
  }

  render () {
    const { layer, layer: { label, sublayers }, isActive, opacity } = this.props;
    const { isOptionsOpen } = this.state;
    const { onActiveChange, onOpacityChange } = this;
    return (
      <Card
        className={`layerNode-container ${(isActive) ? '' : 'options-hidden'}`}
        elevation={Elevation.ZERO}
        style={{ opacity: isActive ? 1 : 0.7 }}
      >
        <div className="layerNode-label-container">
          <Switch
            checked={!!isActive}
            label={label}
            onChange={onActiveChange}
          />
          {isActive && (
            <Button
              className="button-more-vertical"
              icon="more"
              minimal
              onClick={this.handleOptionPanel}
            />
          )}
        </div>
        {isActive && sublayers && (
          <LayersTreeSubItemsList
            layer={layer}
            sublayers={sublayers}
          />
        )}
        {isOptionsOpen && isActive && (
          <OptionsLayer
            onOpacityChange={onOpacityChange}
            opacity={opacity}
          />
        )}
      </Card>
    );
  }
}

export default LayersTreeItem;
