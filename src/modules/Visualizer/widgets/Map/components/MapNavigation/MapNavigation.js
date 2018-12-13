import React from 'react';
import { Button, Card, Classes, Tooltip } from '@blueprintjs/core';

import LayersTree from '../LayersTree';

export const MapNavigation = ({
  toggleLabel,
  onToggle,
  isVisible,
  ContentComponent,
  ...props
}) => (
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
        icon="arrow-right"
        minimal
      />
    </Tooltip>
    <div className="map-navigation__content">
      <ContentComponent
        defaultContentComponent={MapNavigation.defaultProps.ContentComponent}
        {...props}
      />
    </div>
  </Card>
);
MapNavigation.defaultProps = {
  onToggle () {},
  ContentComponent (props) {
    return <LayersTree {...props} />;
  },
};

export default MapNavigation;
