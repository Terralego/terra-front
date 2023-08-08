import React from 'react';
import classNames from 'classnames';
import { Button, Icon } from '@blueprintjs/core';
import './GenericPanelStyles.scss';

const GenericPanel = ({ isOpen, handleClose, visible, left, width, top, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className={classNames('generic-panel', {
        'generic-panel--visible': visible,
        'generic-panel--animate': true,
        'bp3-dark': true,
      })}
      style={{
        left: typeof left === 'number' && typeof width === 'number' && left + width,
      }}
    >
      <div
        className="generic-panel__arrow"
        style={{
          top,
        }}
      />
      <div className="generic-panel__content">
        <div className="generic-panel__header">
          <h2 className="generic-panel__title">{title}</h2>
          <Button minimal onClick={handleClose}>
            <Icon icon="cross" />
          </Button>
        </div>
        <div className="generic-panel__form">{children}</div>
      </div>
    </div>
  );
};

export default GenericPanel;
