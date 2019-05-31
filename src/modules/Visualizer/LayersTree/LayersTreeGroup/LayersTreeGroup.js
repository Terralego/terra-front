import React from 'react';
import { H5, Button, Collapse } from '@blueprintjs/core';

import LayersTreeItem from '../LayersTreeItem';

export class LayersTreeGroup extends React.Component {
  state= {
    isOpen: true,
  }

  handleClick = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  render () {
    const { isOpen } = this.state;
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
              icon={isOpen ? 'chevron-down' : 'chevron-right'}
              minimal
            />
            <H5>{title}</H5>
          </div>
          <Collapse
            isOpen={isOpen}
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
