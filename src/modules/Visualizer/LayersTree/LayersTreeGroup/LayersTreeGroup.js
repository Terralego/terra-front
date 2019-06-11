import React from 'react';
import { H5, Button, Collapse } from '@blueprintjs/core';

import LayersTreeItem from '../LayersTreeItem';

export class LayersTreeGroup extends React.Component {
  // Get open from layer if not set default value
  // eslint-disable-next-line
  state = this.props.layer.initialState || {
    open: true,
  };

  handleClick = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render () {
    const { open } = this.state;
    const {
      title,
      layer: { layers },
      isHidden,
    } = this.props;

    const { handleClick } = this;
    return (
      isHidden ? null : (
        <div className="layerstree-group">
          <div className="layerstree-group__label">
            <Button
              className="layerstree-group__label-button"
              onClick={handleClick}
              icon={open ? 'chevron-down' : 'chevron-right'}
              minimal
            />
            <H5>{title}</H5>
          </div>
          <Collapse
            isOpen={open}
          >
            {layers.map(layer => (
              <LayersTreeItem
                key={layer.label}
                layer={layer}
              />
            ))}
          </Collapse>
        </div>
      )
    );
  }
}

export default LayersTreeGroup;
