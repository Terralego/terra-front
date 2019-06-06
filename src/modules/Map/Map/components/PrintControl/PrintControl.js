
import React from 'react';
import { Icon } from '@blueprintjs/core';
import AbstractMapControl from '../../../helpers/AbstractMapControl';

import './styles.scss';

export class PrintControl extends AbstractMapControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group print-button';

  render () {
    return (
      <button
        className="mapboxgl-ctrl-icon"
        type="button"
        onClick={global.print}
      >
        <Icon
          icon="print"
        />
      </button>
    );
  }
}
export default PrintControl;
