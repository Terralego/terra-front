import React from 'react';
import { Button, Tooltip } from '@blueprintjs/core';

import './styles.scss';

export default ({ isVisible, onToggle, uid }) => (
  <Tooltip
    className="bp3-dark map-navigation__button-container"
    portalClassName="map-navigation__button-tooltip"
    content={isVisible ? 'replier ' : 'déplier'}
  >
    <Button
      className="map-navigation__button"
      onClick={onToggle}
      aria-controls={`map-navigations__content-${uid}`}
      aria-expanded={isVisible}
      icon="arrow-right"
    />
  </Tooltip>
);
