import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const REACT_APP_MAPBOX_API_ACCESS_TOKEN = 'pk.eyJ1IjoidGFzdGF0aGFtMSIsImEiOiJjamZ1ejY2bmYxNHZnMnhxbjEydW9sM29hIn0.w9ndNH49d91aeyvxSjKQqg';

class VisualizerMap extends React.Component {
  componentDidMount () {
    this.initMapProperties();
  }

  componentDidUpdate (prevProps) {
    this.updateMapProperties(prevProps);
  }

  initMapProperties () {
    const {
      mapStyle,
      scaleControl,
      navigationControl,
      attributionControl,
      maxZoom = 20,
      minZoom = 0,
      zoom,
      maxBounds = [
        [-74.04728500751165, 40.68392799015035], // Southwest coordinates
        [-73.91058699000139, 40.87764500765852], // Northeast coordinates
      ],
    } = this.props;

    mapboxgl.accessToken = REACT_APP_MAPBOX_API_ACCESS_TOKEN;
    this.map = new mapboxgl.Map({
      attributionControl: false,
      container: 'visualizer-map',
      style: mapStyle,
      center: [2, 47],
      zoom,
      maxZoom,
      minZoom,
      maxBounds,
      bearing: 0,
    });
    if (scaleControl && !this.scaleControl) {
      this.control = new mapboxgl.ScaleControl();
      this.map.addControl(this.control);
    }

    if (navigationControl && !this.navigationControl) {
      this.navigationControl = new mapboxgl.NavigationControl();
      this.map.addControl(this.navigationControl);
    }

    if (attributionControl && !this.attributionControl) {
      this.attributionControl = new mapboxgl.AttributionControl();
      this.map.addControl(this.attributionControl);
    }
  }

  updateMapProperties = prevProps => {
    const {
      maxZoom,
      mapStyle,
      scaleControl,
      navigationControl,
      attributionControl,
      minZoom,
      maxBounds,
      flyTo,
    } = this.props;

    if (JSON.stringify(prevProps.flyTo) !== JSON.stringify(flyTo)) {
      this.map.flyTo(flyTo);
    }

    if (JSON.stringify(prevProps.maxBounds) !== JSON.stringify(maxBounds)) {
      this.map.setMaxBounds(maxBounds);
    }

    if (prevProps.maxZoom !== maxZoom) {
      this.map.setMaxZoom(maxZoom);
    }

    if (prevProps.minZoom !== minZoom) {
      this.map.setMinZoom(minZoom);
    }

    if (prevProps.mapStyle !== mapStyle) {
      this.map.setStyle(mapStyle);
    }

    if (scaleControl && scaleControl !== prevProps.scaleControl) {
      this.scaleControl = new mapboxgl.ScaleControl();
      this.map.addControl(this.scaleControl);
    }

    if (!scaleControl && scaleControl !== prevProps.scaleControl) {
      this.map.removeControl(this.control);
    }

    if (navigationControl && navigationControl !== prevProps.navigationControl) {
      this.navigationControl = new mapboxgl.NavigationControl();
      this.map.addControl(this.navigationControl);
    }

    if (!navigationControl && navigationControl !== prevProps.navigationControl) {
      this.map.removeControl(this.navigationControl);
    }

    if (attributionControl && attributionControl !== prevProps.attributionControl) {
      this.attributionControl = new mapboxgl.AttributionControl();
      this.map.addControl(this.attributionControl);
    }

    if (!attributionControl && attributionControl !== prevProps.attributionControl) {
      this.map.removeControl(this.attributionControl);
    }
  }

  render () {
    return (
      <div id="visualizer-map" style={{ width: '100%', height: '100%' }} />
    );
  }
}

export default VisualizerMap;
