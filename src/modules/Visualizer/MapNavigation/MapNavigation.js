import React from 'react';
import { Card, Classes } from '@blueprintjs/core';

import MapNavigationButton from './MapNavigationButton';

import './styles.scss';

export const MapNavigation = ({
  title,
  children,
  visible,
  toggleLayersTree,
  renderHeader,
  translate,
}) => {
  const uid = React.useId();

  return (
    <Card
      className={`map-navigation ${Classes.DARK}`}
    >
      {renderHeader && (
        <div className="map-navigation__header">
          {renderHeader}
        </div>
      )}
      {title && <h2 className="map-navigation__title">{title}</h2>}
      <div
        id={`map-navigation__content-${uid}`}
        className="map-navigation__content"
      >
        {children}
      </div>
      <MapNavigationButton
        onToggle={toggleLayersTree}
        isVisible={visible}
        translate={translate}
        uid={uid}
      />
    </Card>
  );
};
MapNavigation.defaultProps = {
  onToggle () {},
};

export default MapNavigation;
