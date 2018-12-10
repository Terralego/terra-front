import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';
import debounce from 'lodash.debounce';

import { toggleLayerVisibility, addListenerOnLayer, setLayerOpacity } from '../../services/mapUtils';
import LayersTreeProps from '../../propTypes/LayersTreePropTypes';
import DefaultMapComponent from './components/Map';
import LayersTree from './components/LayersTree';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import Legend from './components/Legend';

import './styles.scss';

export const INTERACTION_DISPLAY_DETAILS = 'displayDetails';
export const INTERACTION_DISPLAY_TOOLTIP = 'displayTooltip';
export const INTERACTION_FN = 'function';

export class WidgetMap extends React.Component {
  static propTypes = {
    layersTree: LayersTreeProps,
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
    layersTree: [],
    LayersTreeComponent: LayersTree,
    MapComponent: DefaultMapComponent,
    interactions: [],
    setDetails () {},
  };

  state = {
    legends: [],
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
    const popup = this.popups.get(layerId);
    popup.remove();
    this.popups.delete(layerId);
  }, 100);

  componentDidMount () {
    this.setInteractions();
  }

  componentDidUpdate ({ interactions: prevInteractions }) {
    const { interactions } = this.props;

    if (interactions !== prevInteractions) {
      this.setInteractions();
    }
  }

  onChange = async ({ layer, state: { active, opacity } }) => {
    const map = await this.map;

    if (active !== undefined) {
      layer.layers.forEach(layerId => {
        toggleLayerVisibility(map, layerId, active ? 'visible' : 'none');
        this.toggleLegend(layer, active);
      });
    }
    if (opacity !== undefined) {
      layer.layers.forEach(layerId =>
        setLayerOpacity(map, layerId, opacity));
    }
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

  toggleLegend (layer, active) {
    const { legend } = layer;
    if (!legend) return;
    const { legends } = this.state;
    const pos = legends.findIndex(l => l === legend);
    if (active && pos === -1) {
      this.setState({
        legends: [...legends, legend],
      });
    }
    if (!active && pos > -1) {
      legends.splice(pos, 1);
      this.setState({
        legends: [...legends],
      });
    }
  }

  render () {
    const {
      LayersTreeComponent, MapComponent, layersTree, style, interactions, ...mapProps
    } = this.props;
    const { legends } = this.state;
    const { onChange, mapRef } = this;

    return (
      <div
        className="widget-map"
        style={style}
      >
        {!!layersTree.length && (
        <LayersTreeComponent
          layersTree={layersTree}
          onChange={onChange}
        />
        )}
        <MapComponent
          {...mapProps}
          ref={mapRef}
          onDetailsChange={this.onDetailsChange}
        />
        {!!legends.length && (
          <div className="widget-map__legends">
            {legends.map(legend => (
              <Legend {...legend} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default WidgetMap;
