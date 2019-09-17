import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@blueprintjs/core';

import translateMock from '../../../utils/translate';
import withDeviceSize from '../../../hoc/withDeviceSize';
import './styles.scss';

export const MapNavigationButton = ({ isVisible, onToggle, uid, translate, isMobileSized }) => (
  <Tooltip
    className="bp3-dark map-navigation__button-container"
    portalClassName="map-navigation__button-tooltip"
    content={translate(`terralego.visualizer.${isVisible ? 'fold' : 'unfold'}`)}
    disabled={isMobileSized}

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

MapNavigationButton.propTypes = {
  isVisible: PropTypes.bool,
  onToggle: PropTypes.func,
  uid: PropTypes.string,
  translate: PropTypes.func,
};
MapNavigationButton.defaultProps = {
  isVisible: false,
  onToggle () {},
  uid: '',
  translate: translateMock({
    'terralego.visualizer.fold': 'fold',
    'terralego.visualizer.unfold': 'unfold',
  }),
};

export default withDeviceSize()(MapNavigationButton);
