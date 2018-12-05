import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';

import log from '../../services/log';
import { toggleLayerVisibility } from '../../services/mapUtils';
import LayersTreeProps from '../../propTypes/LayersTreePropTypes';
import Map from './components/Map';
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
    MapComponent: Map,
    interactions: [],
    setDetails () {},
  };

  onChange = ({ layer, state: { active } }) => {
    if (active !== undefined) {
      layer.layers.forEach(layerId =>
        toggleLayerVisibility(this.map, layerId, active ? 'visible' : 'none'));
    }
  }

  onClick = (layer, features, event) => {
    const { interactions } = this.props;
    interactions
      .filter(interaction => interaction.id === layer)
      .forEach(({ interaction, ...interactionConfig }) => {
        switch (interaction) {
          case INTERACTION_DISPLAY_DETAILS:
            this.displayDetails({ layer, features, event, ...interactionConfig });
            break;
          case INTERACTION_DISPLAY_TOOLTIP:
            // TODO move this function here instead of Map
            this.displayTooltip({ layer, features, event, ...interactionConfig });
            break;
          case INTERACTION_FN:
            interactionConfig.fn({
              layer,
              features,
              event,
              displayDetails: this.displayDetails,
              displayTooltip: this.displayTooltip,
            });
            break;
          default:
            log(`no interaction found for layer ${layer}`);
        }
      });
  }

  get map () {
    return this.mapRef.current.map;
  }

  mapRef = React.createRef();

  displayDetails = details => {
    const { setDetails } = this.props;
    setDetails(details);
  }

  displayTooltip = ({
    features: [{ properties }] = [{}], event: { lngLat }, template, content,
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

    const popup = new mapBoxGl.Popup();
    popup.setLngLat([lngLat.lng, lngLat.lat]);
    popup.setDOMContent(container);
    popup.addTo(this.map);
  }

  render () {
    const {
      LayersTreeComponent, MapComponent, layersTree, style, interactions, ...mapProps
    } = this.props;
    const { onChange, onClick, mapRef } = this;
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
          onClick={onClick}
          displayPointerOnLayers={displayPointerOnLayers}
        />
      </div>
    );
  }
}

export default WidgetMap;
