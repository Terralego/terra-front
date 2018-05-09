import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import 'openlayers/dist/ol.css';

function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

class TerraDrawMap extends Component {
  componentDidMount () {
    const sourceLayer = new ol.layer.Tile({
      source: new ol.source.OSM({
        url: this.props.osmSource,
      }),
    });
    this.sourceDraw = new ol.source.Vector({ wrapX: false });
    this.vectorDraw = new ol.layer.Vector({
      source: this.sourceDraw,
      zIndex: 100,
    });
    const vectorLayers = [];
    const vectorSourceLayer = new ol.source.VectorTile({
      format: new ol.format.MVT(),
      url: this.props.config.sourceVectorUrl,
      renderMode: 'hybrid',
    });
    this.props.config.vectorLayers.forEach(layer => {
      const vectorLayer = new ol.layer.VectorTile({
        name: layer.name,
        maxResolution: 156543.03392804097 / (2 ** (layer.minZoom - 1)),
        source: vectorSourceLayer,
        zIndex: layer.zIndex ? layer.zIndex : 1,
        style: feature => {
          if (
            layer.type === 'line' &&
            feature.getProperties().layer === layer.layerName
          ) {
            return new ol.style.Style({
              stroke: new ol.style.Stroke(layer.style.draw(feature.get(layer.style.property))),
            });
          } else if (
            layer.type === 'polygon' &&
            feature.getProperties().layer === layer.layerName
          ) {
            return new ol.style.Style({
              fill: new ol.style.Fill(layer.style.draw(feature.get(layer.style.property))),
            });
          }
          return null;
        },
      });

      vectorLayers.push(vectorLayer);
    });

    const view = new ol.View({
      center: ol.proj.fromLonLat(this.props.center),
      zoom: this.props.zoom,
      minZoom: this.props.minZoom,
      maxZoom: this.props.maxZoom,
      extent: [
        ol.proj.fromLonLat(this.props.maxBounds[0]),
        ol.proj.fromLonLat(this.props.maxBounds[1]),
      ]
        .toString()
        .split(','),
    });

    this.map = new ol.Map({
      controls: ol.control
        .defaults({
          attributionOptions: {
            collapsible: false,
          },
        })
        .extend([]),
      target: this.mapContainer,
      layers: [sourceLayer, this.vectorDraw, ...vectorLayers],
      view,
    });

    // this.modify = new ol.interaction.Modify({ source: this.sourceDraw });
    this.select = new ol.interaction.Select({ source: this.sourceDraw });
    // this.snap = new ol.interaction.Snap({ source: this.sourceDraw });

    if (this.props.getDataOnHover) {
      this.map.on('pointermove', e => this.onHover(e));
    }

    if (this.props.getDataOnClick) {
      this.map.on('click', e => this.onClick(e));
    }

    this.sourceDraw.on('addfeature', event => {
      event.feature.setProperties({
        id: guid(),
        name: '',
      });

      if (this.props.getGeometryOnDrawEnd) {
        const properties = event.feature.getProperties();
        this.props.getGeometryOnDrawEnd({
          geometry: event.feature.getGeometry().getCoordinates(),
          properties: {
            name: properties.name,
          },
        });
      }
    });
  }

  onHover (event) {
    const features = this.map.getFeaturesAtPixel(event.pixel, {
      layerFilter: e =>
        this.props.config.vectorLayers
          .map(a => a.name)
          .indexOf(e.get('name')) !== -1,
    });

    if (features) {
      this.props.getDataOnHover(features[0].getProperties());
    }
  }

  onClick (event) {
    const features = this.map.getFeaturesAtPixel(event.pixel, {
      layerFilter: e =>
        this.props.config.vectorLayers
          .map(a => a.name)
          .indexOf(e.get('name')) !== -1,
    });

    if (features) {
      this.props.getDataOnClick(features[0].getProperties());
    }
  }

  setSelectionMode () {
    this.stopDraw();
    // this.map.addInteraction(this.modify);
    this.map.addInteraction(this.select);
    // this.map.addInteraction(this.snap);
  }

  unsetSectionMode () {
    this.map.removeInteraction(this.select);
    // this.map.removeInteraction(this.modify);
    // this.map.removeInteraction(this.snap);
  }

  stopDraw () {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
    }
  }

  startDrawPolygon () {
    this.stopDraw();
    this.unsetSectionMode();

    this.draw = new ol.interaction.Draw({
      source: this.sourceDraw,
      type: 'Polygon',
    });

    this.map.addInteraction(this.draw);
  }

  startDrawLine () {
    this.stopDraw();
    this.unsetSectionMode();

    this.draw = new ol.interaction.Draw({
      source: this.sourceDraw,
      type: 'LineString',
    });

    this.map.addInteraction(this.draw);
  }

  removeFeatureById (id) {
    this.sourceDraw.forEachFeature(feature => {
      if (feature.N.id === id) {
        this.sourceDraw.removeFeature(feature);
      }
    });
  }

  render () {
    return (
      <div
        style={{ height: '100%', width: '100%' }}
        ref={el => {
          this.mapContainer = el;
        }}
      />
    );
  }
}

TerraDrawMap.propTypes = {
  config: PropTypes.shape({
    sourceVectorUrl: PropTypes.string,
    vectorLayers: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      minZoom: PropTypes.number,
      zIndex: PropTypes.number,
      style: PropTypes.shape({
        property: PropTypes.name,
        draw: PropTypes.func,
      }),
      type: PropTypes.string,
      layerName: PropTypes.string,
    })),
  }),
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  maxBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  osmSource: PropTypes.string,
  getGeometryOnDrawEnd: PropTypes.func,
  getDataOnClick: PropTypes.func,
  getDataOnHover: PropTypes.func,
};

TerraDrawMap.defaultProps = {
  config: { sourceVectorUrl: '', vectorLayers: [] },
  minZoom: 11,
  maxZoom: 20,
  zoom: 11,
  center: [2.62322, 48.40813],
  maxBounds: [[2.2917527636, 48.1867854393], [3.1004132613, 48.6260818006]],
  osmSource: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  getGeometryOnDrawEnd: e => e,
  getDataOnClick: e => e,
  getDataOnHover: e => e,
};

export default TerraDrawMap;
