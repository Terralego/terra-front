import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';

import Pointer from './Pointer';
import Polygon from './Polygon';
import Line from './Line';
import Point from './Point';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/**
 * Group of map controls for drawing
 */
const MapDrawButtons = props => {
  const handleChange = e => props.handleChange(e.target.value);
  const { direction } = props || 'horizontal';
  const { showLabel } = props || false;
  const { style } = props || {};
  const labels = props.labels || {
    pointer: 'Select',
    polygon: 'Draw an area',
    line: 'Draw a line',
    point: 'Define a point',
  };

  const getStyle = i => {
    const styleButton = {};

    styleButton.padding = '0 4px';

    if (direction === 'vertical') {
      if (i === 0) {
        styleButton.borderRadius = '4px 4px 0 0';
      } else if (i === props.availableButtons.length - 1) {
        styleButton.borderRadius = '0 0 4px 4px';
      }
      styleButton.lineHeight = '38px';
      styleButton.display = 'block';
    }

    if (!showLabel) {
      styleButton.padding = '4px';
    }

    return styleButton;
  };

  const getColor = mode => (props.mode === mode ? props.selectedColor : props.color);

  return (
    <div style={style}>
      <RadioGroup onChange={handleChange} defaultValue={props.mode}>
        {props.availableButtons.map((button, i) => (
          <RadioButton value={button} style={getStyle(i)} key={`drawmapbutton_${button}`}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {button === 'pointer' && <Pointer color={getColor(button)} /> }
              {button === 'polygon' && <Polygon color={getColor(button)} />}
              {button === 'line' && <Line color={getColor(button)} />}
              {button === 'point' && <Point color={getColor(button)} />}
              {showLabel && <span style={{ margin: '0 5px' }}> {labels[button]}</span>}
            </span>
          </RadioButton>
        ))}
      </RadioGroup>
    </div>
  );
};

MapDrawButtons.propTypes = {
  color: PropTypes.string,
  selectedColor: PropTypes.string,
  mode: PropTypes.string,
  availableButtons: PropTypes.arrayOf(PropTypes.string),
};

MapDrawButtons.defaultProps = {
  color: '#999',
  selectedColor: '#000',
  mode: 'pointer',
  availableButtons: ['pointer', 'polygon', 'line', 'point'],
};

export default MapDrawButtons;
