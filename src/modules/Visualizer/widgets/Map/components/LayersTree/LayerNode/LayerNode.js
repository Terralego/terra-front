import React from 'react';
import { Button, Card, Switch, Elevation } from '@blueprintjs/core';
import OptionsLayer from '../OptionsLayer';
import './styles.scss';

export class LayerNode extends React.Component {
  state = { isOptionsOpen: false };

  handleOptionPanel = () => this.setState({ isOptionsOpen: !this.state.isOptionsOpen });

  render () {
    const { label, onToggleChange, isActive, onOpacityChange, opacity } = this.props;
    const { isOptionsOpen } = this.state;
    return (
      <Card
        className="layerNode-container"
        elevation={Elevation.TWO}
        style={{ opacity: isActive ? 1 : 0.7 }}
      >
        <div className="layerNode-label-container">
          <Switch
            checked={isActive}
            label={label}
            onChange={onToggleChange}
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
export default LayerNode;
