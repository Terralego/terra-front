import React from 'react';
import classNames from 'classnames';
import { Button, Classes, Menu, Popover, Tooltip } from '@blueprintjs/core';

const LayersTreeItemOptionOverflow = ({ hasSomeOptionActive, children, translate }) => {
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);

  const buttons = children.filter(Boolean);
  const overFlowedButtons =
    buttons.length <= 3
      ? []
      : buttons.slice(2).map((button, index) => <li key={button.id ?? index}>{button}</li>);
  const shownButtons = buttons.slice(0, buttons.length <= 3 ? 3 : 2);
  return (
    <div
      className={classNames(
        'layerstree-node-content__options',
        'layerstree-node-content__options--desktop',
        { 'layerstree-node-content__options--active': hasSomeOptionActive || isPopoverOpen },
      )}
    >
      {shownButtons.map((e, index) => (
        <span key={e.id ?? index} className="layerstree-node-content__options__overflow--shown">{e}</span>
      ))}

      {overFlowedButtons.length > 0 && (
        <Popover
          position="bottom"
          autoFocus={false}
          popoverClassName={Classes.POPOVER_DISMISS}
          onOpening={() => setPopoverOpen(true)}
          onClosed={() => setPopoverOpen(false)}
          content={<Menu className="layerstree-options-overflow-menu">{overFlowedButtons}</Menu>}
        >
          <Tooltip
            openOnTargetFocus={false}
            content={translate('terralego.visualizer.layerstree.itemOptions.options.tooltip', {
              context: 'open',
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
