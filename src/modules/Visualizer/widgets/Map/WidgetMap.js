import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import log from '../../services/log';
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
    layersTree: LayersTreeProps.isRequired,
    interactions: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        interaction: INTERACTION_DISPLAY_DETAILS,
        template: PropTypes.string.isRequired,
      }),
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        interaction: INTERACTION_DISPLAY_TOOLTIP,
        template: PropTypes.string.isRequired,
      }),
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        interaction: INTERACTION_FN,
        fn: PropTypes.func.isRequired,
      }),
    ])),
    LayersTreeComponent: PropTypes.func,
    MapComponent: PropTypes.func,
    setDetails: PropTypes.func,
  };

  static defaultProps = {
    LayersTreeComponent: LayersTree,
    MapComponent: Map,
    interactions: [],
    setDetails () {},
  };

  state = {
    stylesToApply: {},
  }

  onChange = stylesToApply => this.setState({ stylesToApply });

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

  displayDetails = details => {
    const { setDetails } = this.props;
    setDetails(details);
  }

  displayTooltip = ({ features: [{ properties }] = [{}], event: { lngLat }, template }) => {
    const container = document.createElement('div');
    ReactDOM.render(<MarkdownRenderer content={template} {...properties} />, container);
    this.setState({
      displayTooltip: {
        coordinates: [lngLat.lng, lngLat.lat],
        container,
      },
    });
  }

  render () {
    const {
      LayersTreeComponent, MapComponent, layersTree, style, interactions, ...mapProps
    } = this.props;
    const { stylesToApply, displayTooltip } = this.state;
    const { onChange, onClick } = this;
    const displayPointerOnLayers = interactions.map(({ id }) => id);

    return (
      <div
        className="widget-map"
        style={style}
      >
        <LayersTreeComponent
          layersTree={layersTree}
          onChange={onChange}
        />
        <MapComponent
          {...mapProps}
          stylesToApply={stylesToApply}
          onDetailsChange={this.onDetailsChange}
          onClick={onClick}
          displayTooltip={displayTooltip}
          displayPointerOnLayers={displayPointerOnLayers}
        />
      </div>
    );
  }
}

export default WidgetMap;
