import React from 'react';
import classNames from 'classnames';

const GenericPanel = ({ visible, left, width, top, title, children }) => (
  <div
    className={classNames('filters-panel', {
      'filters-panel--visible': visible,
      'filters-panel--animate': true,
      'bp3-dark': true,
    })}
    style={{
      left: typeof left === 'number' && typeof width === 'number' && left + width,
    }}
  >
    <div
      className="filters-panel__arrow"
      style={{
        top,
      }}
    />
    <div className="filters-panel__content">
      <div className="filters-panel__header">
        <h2 className="filters-panel__title">{title}</h2>
      </div>
      <div className="filters-panel__form">{children}</div>
    </div>
  </div>
);

export default GenericPanel;
