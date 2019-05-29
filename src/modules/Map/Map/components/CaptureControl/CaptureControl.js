import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@blueprintjs/core';
import { saveAs } from 'file-saver';

import AbstractMapControl from '../../../helpers/AbstractMapControl';
import translateMock from '../../../../../utils/translate';


export class CaptureControl extends AbstractMapControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-capture';

  static propTypes = {
    /** Function used to translate wording. Takes key and object of options as parameters */
    translate: PropTypes.func,
  }

  static defaultProps = {
    translate: translateMock,
  }

  captureScreen = async () => {
    const { map } = this.props;
    const blob = await new Promise(resolve => map.getCanvas().toBlob(resolve));
    saveAs(blob, 'map_screenshot.png');
  }

  render () {
    const { translate } = this.props;
    return (
      <button
        className="mapboxgl-ctrl-icon"
        type="button"
        onClick={this.captureScreen}
        title={translate('terralego.map.capture_control.button_label')}
        aria-label={translate('terralego.map.capture_control.button_label')}
      >
        <Icon icon="download" />
      </button>
    );
  }
}

export default CaptureControl;
