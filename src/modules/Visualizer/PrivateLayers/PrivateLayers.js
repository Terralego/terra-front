import React from 'react';

export class PrivateLayers extends React.Component {
  componentDidMount () {
    this.updatePrivateLayers();
  }

  componentDidUpdate ({
    authenticated: prevAuthenticated,
    layers: prevLayers,
    layersTreeState: prevLayersTreeState,
  }) {
    const { authenticated, layers, layersTreeState } = this.props;

    if (prevAuthenticated !== authenticated ||
        prevLayers !== layers ||
        prevLayersTreeState !== layersTreeState) {
      this.updatePrivateLayers();
    }
  }

  updatePrivateLayers () {
    const { layersTreeState, authenticated, setLayerState } = this.props;

    Array.from(layersTreeState).forEach(([layer, state]) => {
      const { hidden: prevHidden } = state;
      const { private: isPrivate } = layer;
      const hidden = !authenticated && isPrivate;
      if (!!prevHidden !== !!hidden) {
        setLayerState({ layer, state: { hidden } });
      }
    });
  }

  render () {
    return null;
  }
}

export default PrivateLayers;
