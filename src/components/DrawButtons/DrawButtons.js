import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';

import Pointer from './Pointer';
import Polygon from './Polygon';
import Line from './Line';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/**
 * Group of map control for drawing
 * Need to load drawMode module
 */
const DrawButtons = props => {
  const style = {
    lineHeight: '38px',
    padding: '0 4px',
    display: 'block',
  };

  const handleChange = e => props.handleChange(e.target.value);

  const getColor = mode => (props.mode === mode ? props.selectedColor : props.color);

  return (
    <div style={{ position: 'absolute', top: '8px', right: '20px', zIndex: 10 }}>
      <RadioGroup onChange={handleChange} defaultValue={props.mode}>
        <RadioButton value="pointer" style={{ ...style, borderRadius: '0' }}>
          <Pointer color={getColor('pointer')} />
        </RadioButton>
        <RadioButton value="polygon" style={{ ...style, borderRadius: '0' }}>
          <Polygon color={getColor('polygon')} />
        </RadioButton>
        <RadioButton value="line" style={{ ...style, borderRadius: '0 0 4px 4px' }}>
          <Line color={getColor('line')} />
        </RadioButton>
      </RadioGroup>
    </div>
  );
};

DrawButtons.propTypes = {
  color: PropTypes.string,
  selectedColor: PropTypes.string,
  mode: PropTypes.string,
};

DrawButtons.defaultProps = {
  color: '#999',
  selectedColor: '#000',
  mode: 'select',
};

export default DrawButtons;
