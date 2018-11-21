import React,  { Component } from 'react';
import PropTypes from 'prop-types';

import { Card, Switch, Button, Elevation } from '@blueprintjs/core';

import './styles.scss';


class LayerNode extends Component {

  static propTypes = {
    visible: PropTypes.bool,
  };

  static defaultProps = {
    visible: true,
  };

  state = {
    activedStyle: {},
  }

  componentDidMount () {
    this.initLayersProperties();
  }

  initLayersProperties () {
    const { visible } = this.props;
    this.setState({
      visible,
    });
  }

  visibilityChange = () => {
    this.setState({ visible: !this.state.visible });
    this.handleLayerStyle();
  }

  handleLayerStyle = () => {
    console.log(this.state.visible);
    this.state.visible
      ? this.setState({ activedStyle: {} })
      : this.setState({ activedStyle: { opacity: 0.5 } });
  }

  render () {
    const { label, onChange } = this.props;
    const { activedStyle, visible } = this.state;

    return (
      <Card
        className="dataLayerContainer"
        elevation={Elevation.TWO}
        style={activedStyle}
        onChange={onChange(label, visible)}
      >
        <Switch
          checked={visible}
          label={label}
          onChange={this.visibilityChange}
        />
        <Button
          className="buttonMoreVertical"
          icon="more"
          minimal
          onClick={this.handleOptionPanel}
        />
      </Card>
    );
  }
}

export default LayerNode;
