import React from 'react';
import PropTypes from 'prop-types';

import LayersTreeProps from './LayersTreeProps';
import Map from './components/Map';

const LayersTree = () => null;

export class WidgetMap extends React.Component {
  static propTypes = {
    layersTree: LayersTreeProps.isRequired,
    LayersTreeComponent: PropTypes.func,
    MapComponent: PropTypes.func,
  };

  static defaultProps = {
    LayersTreeComponent: LayersTree,
    MapComponent: Map,
  };

  state = {
    stylesToApply: {},
  }

  onChange = stylesToApply => this.setState({ stylesToApply });

  render () {
    const {
      LayersTreeComponent, MapComponent, layersTree, style, ...mapProps
    } = this.props;
    const { stylesToApply } = this.state;
    const { onChange } = this;

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
        />
      </div>
    );
  }
}

export default WidgetMap;
