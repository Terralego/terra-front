import React from 'react';
import { Button, Card, Classes, Tooltip } from '@blueprintjs/core';

import LayersTree from '../LayersTree';

function getUid () {
  return Math.floor((Date.now() * Math.random())).toString(16);
}

export const MapNavigation = ({
  onToggle,
  isVisible,
  ContentComponent,
  ...props
}) => {
  const uid = getUid();
  return (
    <Card
      className={`map-navigation ${Classes.DARK}`}
    >
      <Tooltip
        className="map-navigation__button-container"
        content={isVisible ? 'replier ' : 'déplier'}
      >
        <Button
          className="map-navigation__button"
          onClick={onToggle}
          aria-controls={`map-navigation__content-${uid}`}
          aria-expanded={isVisible}
          icon="arrow-right"
          minimal
        />
      </Tooltip>
      <div id={`map-navigation__content-${uid}`} className="map-navigation__content">
        <ContentComponent
          defaultContentComponent={MapNavigation.defaultProps.ContentComponent}
          {...props}
        />
      </div>
    </Card>
  );
};
MapNavigation.defaultProps = {
  onToggle () {},
  ContentComponent (props) {
    return <LayersTree {...props} />;
  },
};

export default MapNavigation;
