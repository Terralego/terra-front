import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from '@blueprintjs/core';
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
    translate: translateMock({
      'terralego.map.capture_control.button_label': 'Capture map',
    }),
  }

  captureScreen = async () => {
    const { map } = this.props;
    const blob = await new Promise(async resolve => {
      map.once('render', () =>
        map.getCanvas().toBlob(resolve));
      // trigger render
      await map.setBearing(map.getBearing());
    });
    saveAs(blob, 'map_screenshot.png');
  }

  render () {
    const { translate } = this.props;
    return (
      <Tooltip
        content={translate('terralego.map.capture_control.button_label')}
      >
        <button
          className="mapboxgl-ctrl-icon"
          type="button"
          onClick={this.captureScreen}
          aria-label={translate('terralego.map.capture_control.button_label')}
        >
          <Icon icon="download" />
        </button>
      </Tooltip>
    );
  }
}

export default CaptureControl;
