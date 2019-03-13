import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';
import debounce from 'lodash.debounce';
import bbox from '@turf/bbox';
import centroid from '@turf/centroid';

import { setInteractions, checkContraints } from './services/mapUtils';
import { getClusteredFeatures } from '../services/cluster';
import MapComponent from '../Map';
import BackgroundStyles from './components/BackgroundStyles';
import Legend from './components/Legend';
import Tooltip from './components/Tooltip';


import './styles.scss';

export const INTERACTION_ZOOM = 'fitZoom';
export const INTERACTION_DISPLAY_TOOLTIP = 'displayTooltip';
export const INTERACTION_FN = 'function';

export class InteractiveMap extends React.Component {
  static propTypes = {
    backgroundStyle: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
      PropTypes.string,
    ]),
    interactions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      trigger: PropTypes.oneOf(['click', 'mouseover']),
      interaction: PropTypes.oneOf([
        INTERACTION_ZOOM,
        INTERACTION_DISPLAY_TOOLTIP,
        INTERACTION_FN,
      ]),
      constraints: PropTypes.arrayOf(PropTypes.shape({
        minZoom: PropTypes.number,
        maxZoom: PropTypes.number,
        // withLayers takes a list of layers ids which should exists and be visible,
        // or with "!layerId", should not
        withLayers: PropTypes.arrayOf(PropTypes.string),
        // Pass if the feature is a cluster of features
        isCluster: PropTypes.bool,
      })),
      // for INTERACTION_DISPLAY_TOOLTIP
      template: PropTypes.string,
      content: PropTypes.string,
      unique: PropTypes.bool, // Tooltip should be unique in screen
      fixed: PropTypes.bool, // Tooltip should be anchored on feature centroid
      fetchProperties: PropTypes.shape({
        // URL where to fetch properties. Url should take a {{id}} placeholder
        // Ex : /api/something/{{id}}
        url: PropTypes.string.isRequired,
        // name of the feature's property which will fit the "id" placeholder
        id: PropTypes.string.isRequired,
      }),
      // for INTERACTION_FN
      fn: PropTypes.func,
    })),
    legends: PropTypes.arrayOf(PropTypes.shape({

    })),
    onStyleChange: PropTypes.func,
  };

  static defaultProps = {
    backgroundStyle: 'mapbox://styles/mapbox/light-v9',
    interactions: [],
    legends: [],
    onStyleChange () {},
  };

  popups = new Map();

  hideTooltip = debounce(({ layerId }) => {
    if (!this.popups.has(layerId)) {
      return;
    }
    const { popup } = this.popups.get(layerId);
    popup.remove();
    this.popups.delete(layerId);
  }, 100);

  constructor (props) {
    super(props);
    const { backgroundStyle } = props;
    this.state = {
      selectedBackgroundStyle: Array.isArray(backgroundStyle)
        ? backgroundStyle[0].url
        : backgroundStyle,
      legends: [],
    };
  }

  componentDidUpdate ({
    interactions: prevInteractions,
    legends: prevLegends,
  }) {
    const { interactions, legends } = this.props;

    if (interactions !== prevInteractions) {
      this.setInteractions();
    }

    if (legends !== prevLegends) {
      this.filterLegendsByZoom();
    }
  }

  onMapInit = map => {
    const { onMapInit = () => {} } = this.props;
    onMapInit(map);
  }

  onMapLoaded = map => {
    const { onMapLoaded = () => {} } = this.props;
    this.map = map;
    map.on('zoom', this.filterLegendsByZoom);
    this.setInteractions();
    this.filterLegendsByZoom();
    onMapLoaded(map);
  }

  onBackgroundChange = selectedBackgroundStyle => {
    this.setState({ selectedBackgroundStyle });
  };

  getOriginalTarget = ({ originalEvent }) =>
    originalEvent.relatedTarget || originalEvent.explicitOriginalTarget;

  async setInteractions () {
    const { map } = this;

    if (!map) return;

    const { interactions } = this.props;
    setInteractions({ map, interactions, callback: config => this.triggerInteraction(config) });
  }

  filterLegendsByZoom = () => {
    const { legends } = this.props;
    const { map } = this;
    if (!map) return;
    const zoom = map.getZoom();
    const filteredLegends = legends
      .filter(({ minZoom = 0, maxZoom = Infinity }) =>
        ((zoom === 0 && minZoom === 0) || zoom > minZoom) && zoom <= maxZoom);

    this.setState({ legends: filteredLegends });
  }

  fitZoom = ({ feature, map }) =>
    map.fitBounds(bbox({ type: 'FeatureCollection', features: [feature] }));

  displayTooltip ({
    layerId,
    feature,
    feature: { properties } = {},
    event: { lngLat, type },
    template,
    content,
    unique,
    fixed,
    fetchProperties = {},
    clusteredFeatures,
  }) {
    const { history } = this.props;
    const { map } = this;
    const zoom = map.getZoom();
    const container = document.createElement('div');
    ReactDOM.render(
      <Tooltip
        fetch={fetchProperties}
        properties={{
          ...properties,
          clusteredFeatures,
          zoom,
        }}
        template={template}
        content={content}
        history={history}
      />,
      container,
    );

    const lnglat = !fixed
      ? [lngLat.lng, lngLat.lat]
      : centroid(feature).geometry.coordinates;

    if (this.popups.has(layerId)) {
      if (this.popups.get(layerId).content === container.innerHTML) {
        this.popups.get(layerId).popup.setLngLat(lnglat);
        return;
      }
    }

    if (unique) {
      this.popups.forEach(({ popup }) => popup.remove());
      this.popups.clear();
    }
    const popup = new mapBoxGl.Popup();
    popup.once('close', () => this.popups.delete(layerId));
    this.popups.set(layerId, { popup, content: container.innerHTML });
    popup.setLngLat(lnglat);
    popup.setDOMContent(container);
    popup.addTo(map);
    const { _content: popupContent } = popup;

    if (type === 'click') {
      return;
    }

    const onMouseLeave = () => {
      popup.remove();
      popupContent.removeEventListener('mouseleave', onMouseLeave);
    };
    popupContent.addEventListener('mouseleave', onMouseLeave);
  }

  async triggerInteraction ({ map, event, feature, layerId, interaction, eventType }) {
    const { id, interaction: interactionType, fn, trigger = 'click', fixed, constraints, ...config } = interaction;
    if ((trigger === 'mouseover' && !['mousemove', 'mouseleave'].includes(eventType)) ||
        (trigger !== 'mouseover' && trigger !== eventType)) return;

    if (!checkContraints({ map, constraints, feature })) {
      return;
    }
    const clusteredFeatures = await getClusteredFeatures(map, feature);

    switch (interactionType) {
      case INTERACTION_DISPLAY_TOOLTIP:
        if (eventType === 'mouseleave') {
          const { popup = {} } = this.popups.get(layerId) || {};
          const { _content: popupContent } = popup;
          if (!fixed || this.getOriginalTarget(event) !== popupContent) {
            this.hideTooltip({ layerId });
          }
          return;
        }
        this.displayTooltip({
          layerId,
          feature,
          event,
          unique: ['mouseover', 'mousemove'].includes(trigger),
          fixed,
          clusteredFeatures,
          ...config,
        });
        break;
      case INTERACTION_ZOOM:
        this.fitZoom({ feature, map });
        break;
      case INTERACTION_FN:
        fn({ map, event, layerId, feature, instance: this, clusteredFeatures });
        break;
      default:
    }
  }

  render () {
    const {
      layersTree,
      style,
      interactions,
      backgroundStyle,
      onStyleChange,
      ...mapProps
    } = this.props;

    const { selectedBackgroundStyle, legends } = this.state;
    const {
      onMapInit,
      onMapLoaded,
      onBackgroundChange,
    } = this;

    return (
      <div
        className="interactive-map"
        style={style}
      >
        {typeof backgroundStyle !== 'string' && (
          <BackgroundStyles
            onChange={onBackgroundChange}
            styles={backgroundStyle}
            selected={selectedBackgroundStyle}
          />
        )}
        <MapComponent
          {...mapProps}
          backgroundStyle={selectedBackgroundStyle}
          onMapInit={onMapInit}
          onMapLoaded={onMapLoaded}
          onBackgroundChange={onStyleChange}
        />
        {!!legends.length && (
          <div className="interactive-map__legends">
            {legends
              .map(legend => (
                <Legend
                  key={`${legend.title}${legend.items}`}
                  {...legend}
                />
              ))}
          </div>
        )}
      </div>
    );
  }
}

export default InteractiveMap;
