import React from 'react';
import PropTypes from 'prop-types';
import { Slider, Elevation } from '@blueprintjs/core';

import './styles.scss';

function getPercent (v) {
  return parseInt(v * 100, 10);
}

const OptionsLayer = ({ onOpacityChange, opacity }) => (
  <div
    className="layerNode-Option-Container"
    elevation={Elevation.TWO}
  >
    <div>
      <p
        className="layerNode-Option-slider-label"
      >
        Opacité {getPercent(opacity)}%
      </p>
      <Slider
        inititialValue={opacity}
        stepSize={0.00001}
        min={0}
        max={1}
        labelRenderer={false}
        showTrackFill
        value={opacity}
        onChange={onOpacityChange}
      />
    </div>
  </div>
);

OptionsLayer.propTypes = {
  onOpacityChange: PropTypes.func.isRequired,
};

export default OptionsLayer;
