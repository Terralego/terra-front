import React from 'react';
import PropTypes from 'prop-types';

import log from '../../services/log';
import LayersTreeProps from '../../propTypes/LayersTreePropTypes';
import Map from './components/Map';
import LayersTree from './components/LayersTree';

const INTERACTION_DISPLAY_DETAILS = 'displayDetails';
const INTERACTION_DISPLAY_TOOLTIP = 'displayTooltip';

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
      .forEach(({ interaction }) => {
        switch (interaction) {
          case INTERACTION_DISPLAY_DETAILS:
            this.displayDetails({ layer, features, event });
            break;
          case INTERACTION_DISPLAY_TOOLTIP:
            this.displayTooltip({ layer, features, event });
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

  displayTooltip = (/* details */) => {
    // console.log('envoyer une commande à la map pour lui faire afficher un tooltip')
  }

  render () {
    const {
      LayersTreeComponent, MapComponent, layersTree, style, ...mapProps
    } = this.props;
    const { stylesToApply } = this.state;
    const { onChange, onClick } = this;

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
        />
      </div>
    );
  }
}

export default WidgetMap;
