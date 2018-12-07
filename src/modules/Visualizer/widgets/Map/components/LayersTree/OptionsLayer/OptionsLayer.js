import React from 'react';
import PropTypes from 'prop-types';
import { Slider, Elevation } from '@blueprintjs/core';

import './styles.scss';

const OptionsLayer = ({ onOpacityChange, opacity }) => (
  <div
    className="layerNode-Option-Container"
    elevation={Elevation.TWO}
  >
    <div>
      <p className=" layerNode-Option-slider-label">{`Opacité (${parseInt(opacity * 100, 10)}%)`}</p>
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
  onOpacityChange: PropTypes.func,
};

OptionsLayer.defaultProps = {
  onOpacityChange: () => {},
};

export default OptionsLayer;
