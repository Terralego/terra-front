import React from 'react';
import { H5, Button, Collapse } from '@blueprintjs/core';
import classnames from 'classnames';

import LayersTreeItem from '../LayersTreeItem';

export class LayersTreeGroup extends React.Component {
  constructor (props) {
    super(props);
    const { layer: { initialState }, initialOpen: open = true } = props;
    this.state = initialState || {
      open,
    };
  }

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
      level = 0,
    } = this.props;

    const { handleClick } = this;
    return (
      isHidden ? null : (
        <div
          className={classnames(
            'layerstree-group',
            `layerstree-group--${level}`,
            {
              'layerstree-group--active': open,
            },
          )}
        >
          <Button
            className="layerstree-group__label-button"
            onClick={handleClick}
            icon={open ? 'chevron-down' : 'chevron-right'}
            minimal
          >
            <H5>{title}</H5>
          </Button>
          <Collapse
            isOpen={open}
          >
            {layers.map(layer => (layer.group
              ? (
                <LayersTreeGroup
                  key={layer.group}
                  title={layer.group}
                  layer={layer}
                  initialOpen={false}
                  level={level + 1}
                />
              )
              : (
                <LayersTreeItem
                  key={layer.label}
                  layer={layer}
                />
              )))}
          </Collapse>
        </div>
      )
    );
  }
}

export default LayersTreeGroup;
