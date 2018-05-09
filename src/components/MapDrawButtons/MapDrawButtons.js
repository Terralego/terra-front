import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';

import Pointer from './Pointer';
import Polygon from './Polygon';
import Line from './Line';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/**
 * Group of map controls for drawing
 */
const MapDrawButtons = props => {
  const handleChange = e => props.handleChange(e.target.value);

  const getStyle = i => {
    let borderRadius = '0';
    if (i === 0) {
      borderRadius = '4px 4px 0 0';
    } else if (i === props.availableButtons.length - 1) {
      borderRadius = '0 0 4px 4px';
    }

    return {
      lineHeight: '38px',
      padding: '0 4px',
      display: 'block',
      borderRadius,
    };
  };
  const getColor = mode => (props.mode === mode ? props.selectedColor : props.color);

  return (
    <div style={{ position: 'absolute', top: '8px', right: '20px', zIndex: 10 }}>
      <RadioGroup onChange={handleChange} defaultValue={props.mode}>
        {props.availableButtons.map((button, i) => (
          <RadioButton value={button} style={getStyle(i)} key={`drawmapbutton_${button}`}>
            {button === 'pointer' && <Pointer color={getColor(button)} />}
            {button === 'polygon' && <Polygon color={getColor(button)} />}
            {button === 'line' && <Line color={getColor(button)} />}
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
  availableButtons: ['pointer', 'polygon', 'line'],
};

export default MapDrawButtons;
