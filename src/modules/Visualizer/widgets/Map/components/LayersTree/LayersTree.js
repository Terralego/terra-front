import React, { Component } from 'react';
import PropTypes from 'prop-types';

import layersTreePropsTypes from '../../../../propTypes/LayersTreePropTypes';
import LayersTreeRenderer from './LayersTreeRenderer';

export class LayersTree extends Component {
  static propTypes = {
    layersTree: layersTreePropsTypes.isRequired,
    render: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    render: LayersTreeRenderer,
    onChange () {},
  };

  state = {
    areActives: new Set(this.props.layersTree
      .map(layer => ((layer.initialState || {}).active ? layer : null))
      .filter(a => a)),
    opacities: this.props.layersTree
      .reduce((ops, { label, initialState: { opacity = 1 } = {} }) =>
        ({ ...ops, [label]: opacity }), {}),
  };

  componentDidMount () {
    const { onChange, layersTree } = this.props;
    layersTree.forEach(layer => {
      if (!layer.initialState) return;
      if (layer.initialState.active !== undefined) {
        onChange({ layer, state: { active: layer.initialState.active } });
      }
    });
  }

  onToggleChange = layer => () => {
    const { onChange } = this.props;
    const { areActives } = this.state;
    const isActive = areActives.has(layer);
    if (isActive) {
      areActives.delete(layer);
    } else {
      areActives.add(layer);
    }
    this.setState({ areActives: new Set(areActives) });
    onChange({ layer, state: { active: !isActive } });
  }

  onOpacityChange = layer => opacity => {
    const { onChange } = this.props;
    const { opacities } = this.state;
    this.setState({ opacities: {
      ...opacities,
      [layer.label]: opacity,
    } });
    onChange({ layer, state: { opacity } });
  }

  getOpacity = layer => {
    const { opacities } = this.state;
    return opacities[layer.label];
  }

  isActive = layer => {
    const areActives = new Set(this.state.areActives);
    return areActives.has(layer);
  }

  render () {
    const { render: Render, layersTree, title, onChange } = this.props;
    const { onToggleChange, isActive, onOpacityChange, getOpacity } = this;
    const props = {
      layersTree,
      title,
      onChange,
      onToggleChange,
      isActive,
      LayersTree,
      onOpacityChange,
      getOpacity,
    };

    return <Render {...props} />;
  }
}

export default LayersTree;
