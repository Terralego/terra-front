import React from 'react';
import classNames from 'classnames';
import { Button, Menu, Popover, Tooltip } from '@blueprintjs/core';

const LayersTreeItemOptionOverflow = ({ hasSomeOptionActive, children, translate }) => {
  const buttons = children.filter(Boolean);
  const overFlowedButtons = buttons.slice(2).map(button => <li>{button}</li>);
  return (
    <div
      className={classNames(
        'layerstree-node-content__options',
        'layerstree-node-content__options--desktop',
        { 'layerstree-node-content__options--active': hasSomeOptionActive },
      )}
    >
      {buttons.slice(0, 2).map(e => (
        <span className="layerstree-node-content__options__overflow--shown">{e}</span>
      ))}

      {overFlowedButtons.length > 0 && (
        <Popover
          position="bottom"
          autoFocus={false}
          content={
            <Menu className="layerstree-options-overflow-menu">{overFlowedButtons}</Menu>
          }
        >
          <Tooltip
            openOnTargetFocus={false}
            content={translate('terralego.visualizer.layerstree.itemOptions.options.tooltip', {
              context: 'close',
            })}
            className="layerNode__tooltip options"
          >
            <Button
              className={classNames(
                'layerstree-node-content__options__button',
                'layerstree-node-content__options__button--more',
              )}
              icon="more"
              minimal
              title={translate('terralego.visualizer.layerstree.itemOptions.options.label')}
              alt={translate('terralego.visualizer.layerstree.itemOptions.options.alt', {
                context: 'close',
              })}
            />
          </Tooltip>
        </Popover>
      )}
    </div>
  );
};

export default LayersTreeItemOptionOverflow;
