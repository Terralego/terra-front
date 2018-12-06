import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';
import debounce from 'lodash.debounce';

import { toggleLayerVisibility, addListenerOnLayer } from '../../services/mapUtils';
import LayersTreeProps from '../../propTypes/LayersTreePropTypes';
import DefaultMapComponent from './components/Map';
import LayersTree from './components/LayersTree';
import MarkdownRenderer from '../../components/MarkdownRenderer';

import './styles.scss';

const INTERACTION_DISPLAY_DETAILS = 'displayDetails';
const INTERACTION_DISPLAY_TOOLTIP = 'displayTooltip';
const INTERACTION_FN = 'function';

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


  componentDidMount () {
    this.setInteractions();
  }

  componentDidUpdate ({ interactions: prevInteractions }) {
    const { interactions } = this.props;

    if (interactions !== prevInteractions) {
      this.setInteractions();
    }
  }

  onChange = ({ layer, state: { active } }) => {
    if (active !== undefined) {
      layer.layers.forEach(layerId =>
        toggleLayerVisibility(this.map, layerId, active ? 'visible' : 'none'));
    }
  }

  setInteractions () {
    const { interactions } = this.props;

    if (!this.map) {
      setTimeout(() => this.setInteractions(), 10);
      return;
    }

    if (this.mapInteractionsListeners) {
      this.mapInteractionsListeners.forEach(off => off());
    }

    this.mapInteractionsListeners = [];

    interactions.forEach(({ id, trigger, interaction, fn, ...config }) => {
      const calls = [];
      switch (interaction) {
        case INTERACTION_DISPLAY_DETAILS:
          calls.push({
            callback: (layerId, features) => this.displayDetails({ features, ...config }),
            trigger,
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
              displayCursor: false,
            });
          } else {
            calls.push({
              callback: (layerId, features, event) =>
                this.displayTooltip({ layerId, features, event, ...config }),
              trigger,
            });
          }
          break;
        case INTERACTION_FN:
          calls.push({
            callback: fn,
          });
          break;
        default:
          return;
      }
      const listeners = calls.reduce((list, { callback, trigger: callTrigger, displayCursor }) => [
        ...list,
        ...addListenerOnLayer(
          this.map,
          id,
          callback,
          { displayCursor, trigger: callTrigger },
        ),
      ], []);

      this.mapInteractionsListeners = this.mapInteractionsListeners.concat(listeners);
    });
  }

  get map () {
    return this.mapRef.current.map;
  }

  popups = new Map();

  mapRef = React.createRef();

  displayDetails = ({ features, template }) => {
    const { setDetails } = this.props;
    setDetails({ features, template });
  }

  displayTooltip = ({
    layerId,
    features: [{ properties }] = [{}],
    event: { lngLat },
    template,
    content,
  }) => {
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
    popup.addTo(this.map);
  }

  hideTooltip = debounce(({ layerId }) => {
    if (!this.popups.has(layerId)) {
      return;
    }
    const popup = this.popups.get(layerId);
    popup.remove();
    this.popups.delete(layerId);
  }, 100);

  render () {
    const {
      LayersTreeComponent, MapComponent, layersTree, style, interactions, ...mapProps
    } = this.props;
    const { onChange, mapRef } = this;
    const displayPointerOnLayers = interactions.map(({ id }) => id);

    return (
      <div
        className="widget-map"
        style={style}
      >
        {layersTree.length &&
          <LayersTreeComponent
            layersTree={layersTree}
            onChange={onChange}
          />
        }
        <MapComponent
          {...mapProps}
          ref={mapRef}
          onDetailsChange={this.onDetailsChange}
          displayPointerOnLayers={displayPointerOnLayers}
        />
      </div>
    );
  }
}

export default WidgetMap;
