import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';
import debounce from 'lodash.debounce';
import bbox from '@turf/bbox';
import centroid from '@turf/centroid';

import { setInteractions } from './services/mapUtils';
import MapComponent from '../Map';
import BackgroundStyles from './components/BackgroundStyles';
import MarkdownRenderer from '../../Template/MarkdownRenderer';
import Legend from './components/Legend';


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
      fixed: PropTypes.bool,
      // for INTERACTION_DISPLAY_DETAILS
      // and INTERACTION_DISPLAY_TOOLTIP
      template: PropTypes.string,
      content: PropTypes.string,
      // for INTERACTION_FN
      fn: PropTypes.func,
    })),
    legends: PropTypes.arrayOf(PropTypes.shape({

    })),
  };

  static defaultProps = {
    backgroundStyle: 'mapbox://styles/mapbox/light-v9',
    interactions: [],
    legends: [],
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
    };
  }

  componentDidUpdate ({
    interactions: prevInteractions,
  }) {
    const { interactions } = this.props;

    if (interactions !== prevInteractions) {
      this.setInteractions();
    }
  }

  onMapInit = map => {
    const { onMapInit = () => {} } = this.props;
    onMapInit(map);
  }

  onMapLoaded = map => {
    const { onMapLoaded = () => {} } = this.props;
    this.map = map;
    this.setInteractions();
    onMapLoaded(map);
  }

  onBackgroundChange = selectedBackgroundStyle => {
    this.map.once('style.load', () => {
      this.updateLayersTree();
    });
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

  fitZoom = ({ feature, map }) =>
    map.fitBounds(bbox({ type: 'FeatureCollection', features: [feature] }));

  displayTooltip = ({
    layerId,
    feature: { properties, geometry } = {},
    event: { lngLat, type },
    template,
    content,
    unique,
    fixed,
  }) => {
    const { history } = this.props;
    const { map } = this;
    const container = document.createElement('div');
    ReactDOM.render(
      <MarkdownRenderer
        template={template}
        content={content}
        history={history}
        {...properties}
      />,
      container,
    );

    const lnglat = !fixed
      ? [lngLat.lng, lngLat.lat]
      : centroid(geometry).geometry.coordinates;

    if (this.popups.has(layerId)) {
      if (this.popups.get(layerId).content === container.innerHTML) {
        this.popups.get(layerId).popup.setLngLat(lnglat);
      }
      return;
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

  triggerInteraction ({ map, event, feature, layerId, interaction, eventType }) {
    const { id, interaction: interactionType, fn, trigger = 'click', fixed, constraints, ...config } = interaction;

    if ((trigger === 'mouseover' && !['mousemove', 'mouseleave'].includes(eventType)) ||
        (trigger !== 'mouseover' && trigger !== eventType)) return;

    if (constraints) {
      const currentZoom = map.getZoom();
      const {
        minZoom = 0,
        maxZoom = Infinity,
      }  = constraints;
      if (currentZoom >= maxZoom || currentZoom <= minZoom) {
        return;
      }
    }

    switch (interactionType) {
      case INTERACTION_DISPLAY_TOOLTIP:
        if (eventType === 'mouseleave') {
          const { popup = {} } = this.popups.get(layerId) || {};
          const { _content: popupContent } = popup;

          if (!fixed || this.getOriginalTarget(event) !== popupContent) {
            this.hideTooltip({ layerId });
          }
        }
        this.displayTooltip({
          layerId,
          feature,
          event,
          unique: ['mouseover', 'mousemove'].includes(trigger),
          fixed,
          ...config,
        });
        break;
      case INTERACTION_ZOOM:
        this.fitZoom({ feature, map });
        break;
      case INTERACTION_FN:
        fn({ map, event, layerId, feature, widgetMapInstance: this });
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
      legends,
      ...mapProps
    } = this.props;

    const { selectedBackgroundStyle } = this.state;
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
        />
        {!!legends.length && (
          <div className="interactive-map__legends">
            {legends
              .map(legend => (
                <Legend
                  key={legend.title}
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
