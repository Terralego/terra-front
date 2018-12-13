import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';
import debounce from 'lodash.debounce';

import { context } from './connect';
import { toggleLayerVisibility, addListenerOnLayer, setLayerOpacity } from '../../services/mapUtils';
import LayersTreeProps from '../../propTypes/LayersTreePropTypes';
import DefaultMapComponent from './components/Map';
import LayersTree from './components/LayersTree';
import BackgroundStyles from './components/BackgroundStyles';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import Legend from './components/Legend';

import './styles.scss';

export const INTERACTION_DISPLAY_DETAILS = 'displayDetails';
export const INTERACTION_DISPLAY_TOOLTIP = 'displayTooltip';
export const INTERACTION_FN = 'function';

const { Provider } = context;

export class WidgetMap extends React.Component {
  static propTypes = {
    layersTree: LayersTreeProps,
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
    LayersTreeComponent: PropTypes.func,
    MapComponent: PropTypes.func,
    setDetails: PropTypes.func,
  };

  static defaultProps = {
    backgroundStyle: 'mapbox://styles/mapbox/light-v9',
    layersTree: [],
    LayersTreeComponent: LayersTree,
    MapComponent: DefaultMapComponent,
    interactions: [],
    setDetails () {},
  };

  mapRef = React.createRef();

  state = {
    selectedBackgroundStyle: Array.isArray(this.props.backgroundStyle)
      ? this.props.backgroundStyle[0].url
      : this.props.backgroundStyle,
    layersTreeState: new Map(),
    isLayersTreeVisible: true,
  };

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
    const popup = this.popups.get(layerId);
    popup.remove();
    this.popups.delete(layerId);
  }, 100);

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

  onBackgroundChange = selectedBackgroundStyle => this.setState({ selectedBackgroundStyle });

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

    if (this.mapInteractionsListeners) {
      this.mapInteractionsListeners.forEach(off => off());
    }

    this.mapInteractionsListeners = [];

    interactions.forEach(({ id, trigger = 'click', interaction, fn, ...config }) => {
      const calls = [];
      switch (interaction) {
        case INTERACTION_DISPLAY_DETAILS:
          calls.push({
            callback: (layerId, features) => this.displayDetails({ features, ...config }),
            trigger,
            displayCursor: trigger === 'click',
          });
          break;
        case INTERACTION_DISPLAY_TOOLTIP:
          if (trigger === 'mouseover') {
            calls.push({
              callback: (layerId, features, event) =>
                this.displayTooltip({ layerId, features, event, ...config }),
              trigger: 'mousemove',
            });
            calls.push({
              callback: (layerId, features, event) =>
                this.hideTooltip({ layerId, features, event, ...config }),
              trigger: 'mouseleave',
            });
          } else {
            calls.push({
              callback: (layerId, features, event) =>
                this.displayTooltip({ layerId, features, event, ...config }),
              trigger,
              displayCursor: trigger === 'click',
            });
          }
          break;
        case INTERACTION_FN:
          calls.push({
            callback: fn,
            trigger,
            displayCursor: trigger === 'click',
          });
          break;
        default:
          return;
      }
      const listeners = calls.reduce((list, { callback, trigger: callTrigger, displayCursor }) => [
        ...list,
        ...addListenerOnLayer(
          map,
          id,
          callback,
          { displayCursor, trigger: callTrigger },
        ),
      ], []);

      this.mapInteractionsListeners = this.mapInteractionsListeners.concat(listeners);
    });
  }

  setLayerState = ({ layer, state }) => {
    const { layersTreeState: prevLayersTreeState } = this.state;
    const layersTreeState = new Map(prevLayersTreeState);
    const layerState = layersTreeState.get(layer);

    if (!layerState) return;

    layersTreeState.set(layer, {
      ...layerState,
      ...state,
    });
    this.setState({ layersTreeState });
  }

  getLayerState = ({ layer }) => {
    const { layersTreeState } = this.state;
    const layerState = layersTreeState.get(layer);

    return layerState || {};
  }

  displayDetails = ({ features, template }) => {
    const { setDetails } = this.props;
    setDetails({ features, template });
  }

  displayTooltip = async ({
    layerId,
    features: [{ properties }] = [{}],
    event: { lngLat },
    template,
    content,
  }) => {
    const map = await this.map;
    const container = document.createElement('div');
    ReactDOM.render(
      <MarkdownRenderer
        template={template}
        content={content}
        {...properties}
      />,
      container,
    );

    if (this.popups.has(layerId)) {
      this.popups.get(layerId).setLngLat([lngLat.lng, lngLat.lat]);
      return;
    }
    const popup = new mapBoxGl.Popup();
    this.popups.set(layerId, popup);
    popup.setLngLat([lngLat.lng, lngLat.lat]);
    popup.setDOMContent(container);
    popup.addTo(map);
  }

  selectSublayer = ({ layer, sublayer }) => {
    const { layersTreeState: prevLayersTreeState } = this.state;
    const layersTreeState = new Map(prevLayersTreeState);
    const layerState = layersTreeState.get(layer);
    layerState.sublayers = layerState.sublayers.map((_, k) => k === sublayer);
    layersTreeState.set(layer, { ...layerState });
    this.setState({ layersTreeState });
  }

  toggleLayersTree = () => this.setState({ isLayersTreeVisible: !this.state.isLayersTreeVisible })

  initLayersState () {
    const { layersTree } = this.props;
    const layersTreeState = new Map();
    function reduceLayers (group, map) {
      return group.reduce((layersStateMap, layer) => {
        const { initialState = {}, sublayers } = layer;
        const { active } = initialState;
        if (sublayers) {
          initialState.sublayers = initialState.sublayers || sublayers.map((_, k) =>
            (k === 0 && !!active));
        }
        if (layer.group) {
          return reduceLayers(layer.layers, layersStateMap);
        }
        initialState.opacity = initialState.opacity || 1;
        layersStateMap.set(layer, {
          active: false,
          opacity: 1,
          ...initialState,
        });
        return layersStateMap;
      }, map);
    }
    this.setState({
      layersTreeState: reduceLayers(layersTree, layersTreeState),
    });
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
      MapComponent,
      layersTree,
      style,
      interactions,
      backgroundStyle,
      ...mapProps
    } = this.props;

    const { selectedBackgroundStyle, isLayersTreeVisible } = this.state;
    const {
      onChange,
      mapRef,
      getLayerState,
      setLayerState,
      selectSublayer,
      legends,
      onBackgroundChange,
      toggleLayersTree,
    } = this;
    const contextValue = {
      getLayerState,
      setLayerState,
      selectSublayer,
    };

    return (
      <Provider value={contextValue}>
        <div
          className={`widget-map ${isLayersTreeVisible ? 'widget-map--layerstree-is-visible' : ''}`}
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
          <LayersTreeComponent
            layersTree={layersTree}
            onChange={onChange}
            toggleLabel={isLayersTreeVisible ? 'replier ' : 'déplier'}
            onToggle={toggleLayersTree}
          />
          )}
          <MapComponent
            {...mapProps}
            ref={mapRef}
            backgroundStyle={selectedBackgroundStyle}
            onDetailsChange={this.onDetailsChange}
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
        </div>
      </Provider>
    );
  }
}

export default WidgetMap;
