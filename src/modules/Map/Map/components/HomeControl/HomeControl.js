import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@blueprintjs/core';

import AbstractMapControl from '../../../helpers/AbstractMapControl';
import translateMock from '../../../../../utils/translate';

export class HomeControl extends AbstractMapControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-home';

  static propTypes = {
    /** Function used to translate wording. Takes key and object of options as parameters */
    translate: PropTypes.func,
  }

  static defaultProps = {
    translate: translateMock({
      'terralego.map.home_control.button_label': 'Home',
    }),
  }

  goHome = () => {
    const { map, fitBounds, center, zoom = 7 } = this.props;
    if (fitBounds) {
      map.fitBounds(fitBounds, {
        padding: 10,
      });
      return;
    }

    if (center) {
      map.flyTo({ center, zoom });
    }
  }

  render () {
    const { translate } = this.props;

    return (
      <button
        className="mapboxgl-ctrl-icon"
        type="button"
        onClick={this.goHome}
        title={translate('terralego.map.home_control.button_label')}
        aria-label={translate('terralego.map.home_control.button_label')}
      >
        <Icon icon="home" />
      </button>
    );
  }
}

export default HomeControl;
