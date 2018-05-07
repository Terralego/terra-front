import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changeMode } from 'modules/drawMode';

import Polygon from './Polygon';
import Line from './Line';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const DrawButtons = props => {
  const style = {
    lineHeight: '38px',
    padding: '0 4px',
    display: 'block',
  };

  const handleChange = e => props.changeMode(e.target.value);

  const getColor = mode => (props.mode === mode ? props.selectedColor : props.color);

  return (
    <div style={{ position: 'absolute', top: '8px', right: '20px', zIndex: 10 }}>
      <RadioGroup onChange={handleChange} defaultValue="polygon">
        <RadioButton value="polygon" style={{ ...style, borderRadius: '4px 4px 0 0' }}>
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
};

DrawButtons.defaultProps = {
  color: '#999',
  selectedColor: '#000',
};

const StateToProps = state => ({
  mode: state.drawMode.mode,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeMode,
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(DrawButtons);
