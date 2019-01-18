import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';
import debounce from 'lodash.debounce';

import { context } from './connect';
import { initLayersStateAction, selectSublayerAction, setLayerStateAction } from './layerTreeUtils';
import { toggleLayerVisibility, setInteractions, setLayerOpacity } from './services/mapUtils';
import MapComponent from '../Map';
import MapNavigation from './components/MapNavigation';
import BackgroundStyles from './components/BackgroundStyles';
import MarkdownRenderer from '../../Template/MarkdownRenderer';
import Legend from './components/Legend';
import Details from './components/Details';


import './styles.scss';

export const INTERACTION_DISPLAY_DETAILS = 'displayDetails';
export const INTERACTION_DISPLAY_TOOLTIP = 'displayTooltip';
export const INTERACTION_FN = 'function';

const { Provider } = context;

const LayersTreeProps = PropTypes.shape({
  label: PropTypes.string.isRequired,
  layers: PropTypes.arrayOf(PropTypes.string),
  initialState: PropTypes.shape({
    active: PropTypes.bool,
  }),
});

const LayersTreeGroupProps = PropTypes.shape({
  group: PropTypes.string.isRequired,
  layers: PropTypes.arrayOf(LayersTreeProps.isRequired),
});


export class WidgetMap extends React.Component {
  static propTypes = {
    layersTree: PropTypes.arrayOf(PropTypes.oneOfType([
      LayersTreeProps,
      LayersTreeGroupProps,
    ])),
    backgroundStyle: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
      PropTypes.string,
    ]),
    interactions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      trigger: PropTypes.oneOf(['click', 'mouseover']),
      interaction: PropTypes.oneOf([
        INTERACTION_DISPLAY_DETAILS,
        INTERACTION_DISPLAY_TOOLTIP,
        INTERACTION_FN,
      ]),
      // for INTERACTION_DISPLAY_DETAILS
      // and INTERACTION_DISPLAY_TOOLTIP
      template: PropTypes.string,
      content: PropTypes.string,
      // for INTERACTION_FN
      fn: PropTypes.func,
    })),
  };

  static defaultProps = {
    backgroundStyle: 'mapbox://styles/mapbox/light-v9',
    layersTree: [],
    interactions: [],
  };

  mapRef = React.createRef();

  map = new Promise(resolve => {
    const waitForMap = () => {
      if (this.mapRef && this.mapRef.current && this.mapRef.current.map) {
        resolve(this.mapRef.current.map);
        return;
      }
      setTimeout(waitForMap, 10);
    };
    waitForMap();
  });

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
      layersTreeState: new Map(),
      isLayersTreeVisible: true,
    };
  }

  componentDidMount () {
    this.initLayersState();
    this.setInteractions();
  }

  componentDidUpdate ({
    interactions: prevInteractions,
  }, {
    layersTreeState: prevLayersTreeState,
  }) {
    const { interactions } = this.props;
    const { layersTreeState } = this.state;

    if (interactions !== prevInteractions) {
      this.setInteractions();
    }

    if (prevLayersTreeState !== layersTreeState) {
      this.updateLayersTree();
    }
  }

  onBackgroundChange = selectedBackgroundStyle => {
    this.mapRef.current.map.once('style.load', () => {
      this.updateLayersTree();
    });
    this.setState({ selectedBackgroundStyle });
  };

  get legends () {
    const { layersTreeState } = this.state;
    const legends = Array.from(layersTreeState.entries())
      .map(([layer, state]) => {
        if (!state.active) return undefined;
        if (layer.sublayers) {
          const selected = state.sublayers.findIndex(active => active);
          const selectedSublayer = layer.sublayers[selected];
          return selectedSublayer && selectedSublayer.legend && ({
            title: selectedSublayer.label,
            ...selectedSublayer.legend,
          });
        }
        return layer.legend && ({
          title: layer.label,
          ...layer.legend,
        });
      })
      .filter(defined => defined);

    return legends;
  }

  async setInteractions () {
    const map = await this.map;
    const { interactions } = this.props;
    setInteractions({ map, interactions, callback: config => this.triggerInteraction(config) });
  }

  setLayerState = ({ layer, state: layerState }) => {
    this.setState(state => ({
      ...state,
      layersTreeState: setLayerStateAction(layer, layerState, state.layersTreeState),
    }));
  }

  getLayerState = ({ layer }) => {
    const { layersTreeState } = this.state;
    const layerState = layersTreeState.get(layer);

    return layerState || {};
  }

  displayDetails = ({ feature, template }) => {
    this.setState({ details: { feature, template } });
  }

  closeDetails = () => {
    this.setState({ details: null });
  }

  displayTooltip = async ({
    layerId,
    feature: { properties } = {},
    event: { lngLat },
    template,
    content,
    unique,
  }) => {
    const { history } = this.props;
    const map = await this.map;
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

    if (this.popups.has(layerId) &&
        this.popups.get(layerId).content === container.innerHTML) {
      this.popups.get(layerId).popup.setLngLat([lngLat.lng, lngLat.lat]);
      return;
    }

    if (unique) {
      this.popups.forEach(({ popup }) => popup.remove());
      this.popups.clear();
    }

    const popup = new mapBoxGl.Popup();
    popup.once('close', () => this.popups.delete(layerId));
    this.popups.set(layerId, { popup, content: container.innerHTML });
    popup.setLngLat([lngLat.lng, lngLat.lat]);
    popup.setDOMContent(container);
    popup.addTo(map);
  }

  selectSublayer = ({ layer, sublayer }) => {
    this.setState(state => ({
      ...state,
      layersTreeState: selectSublayerAction(layer, sublayer, state.layersTreeState),
    }));
  }

  toggleLayersTree = () => {
    this.setState(state => ({
      ...state,
      isLayersTreeVisible: !state.isLayersTreeVisible,
    }));
  }

  triggerInteraction ({ map, event, feature, layerId, interaction, eventType }) {
    const { id, interaction: interactionType, fn, trigger = 'click', ...config } = interaction;

    if ((trigger === 'mouseover' && !['mousemove', 'mouseleave'].includes(eventType)) ||
        (trigger !== 'mouseover' && trigger !== eventType)) return;

    switch (interactionType) {
      case INTERACTION_DISPLAY_DETAILS:
        this.displayDetails({ feature, ...config });
        break;
      case INTERACTION_DISPLAY_TOOLTIP:
        if (eventType === 'mouseleave') {
          this.hideTooltip({ layerId });
        }
        this.displayTooltip({
          layerId,
          feature,
          event,
          unique: ['mouseover', 'mousemove'].includes(trigger),
          ...config,
        });
        break;
      case INTERACTION_FN:
        fn({ map, event, layerId, feature, widgetMapInstance: this });
        break;
      default:
    }
  }

  initLayersState () {
    const { layersTree } = this.props;
    this.setState(state => ({
      ...state,
      layersTreeState: initLayersStateAction(layersTree),
    }));
  }

  async updateLayersTree () {
    const map = await this.map;
    const { layersTreeState } = this.state;
    layersTreeState.forEach(({ active, opacity, sublayers }, layer) => {
      if (sublayers) {
        if (active) {
          layer.sublayers.forEach((sublayer, index) => {
            const sublayerActive = sublayers[index];
            sublayer.layers.forEach(layerId => {
              toggleLayerVisibility(map, layerId, sublayerActive ? 'visible' : 'none');
            });
          });
        } else {
          layer.sublayers.forEach(sublayer => {
            sublayer.layers.forEach(layerId => {
              toggleLayerVisibility(map, layerId, 'none');
            });
          });
        }

        layer.sublayers.forEach(sublayer => {
          sublayer.layers.forEach(layerId => {
            setLayerOpacity(map, layerId, opacity);
          });
        });
      }

      if (active !== undefined && layer.layers) {
        layer.layers.forEach(layerId => {
          toggleLayerVisibility(map, layerId, active ? 'visible' : 'none');
        });
      }
      if (opacity !== undefined && layer.layers) {
        layer.layers.forEach(layerId =>
          setLayerOpacity(map, layerId, opacity));
      }
    });
  }

  render () {
    const {
      LayersTreeComponent,
      layersTree,
      style,
      interactions,
      backgroundStyle,
      ...mapProps
    } = this.props;

    const { selectedBackgroundStyle, isLayersTreeVisible, details } = this.state;
    const {
      mapRef,
      getLayerState,
      setLayerState,
      selectSublayer,
      legends,
      onBackgroundChange,
      toggleLayersTree,
      closeDetails,
    } = this;
    const contextValue = {
      getLayerState,
      setLayerState,
      selectSublayer,
    };
    const visible = !!details;
    const { feature: { properties } = {}, template = '' } = details || {};

    return (
      <Provider value={contextValue}>
        <div
          className={`interactive-map widget-map ${isLayersTreeVisible ? 'widget-map--layerstree-is-visible' : ''}`}
          style={style}
        >
          {typeof backgroundStyle !== 'string' && (
            <BackgroundStyles
              onChange={onBackgroundChange}
              styles={backgroundStyle}
              selected={selectedBackgroundStyle}
            />
          )}
          {!!layersTree.length && (
            <MapNavigation
              layersTree={layersTree}
              isVisible={isLayersTreeVisible}
              onToggle={toggleLayersTree}
            />
          )}
          <MapComponent
            {...mapProps}
            ref={mapRef}
            backgroundStyle={selectedBackgroundStyle}
          />
          {!!legends.length && (
            <div className="widget-map__legends">
              {legends
                .map(legend => (
                  <Legend
                    key={legend.title}
                    {...legend}
                  />
                ))}
            </div>
          )}
          <Details
            visible={visible}
            template={template}
            onClose={closeDetails}
            {...properties}
          />
        </div>
      </Provider>
    );
  }
}

export default WidgetMap;
