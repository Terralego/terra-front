import React from 'react';
import PropTypes from 'prop-types';
import deepmerge from 'deepmerge';

import Map from './components/Map';

const LayersTree = () => null;

export class WidgetMap extends React.Component {
  static propTypes = {
    layersTree: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      active: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
      })),
      inactive: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
      })),
    })).isRequired,
  };

  state = {
    layouts: [],
  }

  onChange = newLayouts => {
    const { layouts: prevLayouts } = this.state;
    const layouts = newLayouts.map(layout => {
      const inPrevLayouts = prevLayouts.find(({ id }) => id === layout.id);
      return inPrevLayouts
        ? deepmerge(inPrevLayouts, layout)
        : layout;
    }).concat(prevLayouts.map(layout => {
      const inNewLayouts = newLayouts.find(({ id }) => id === layout.id);
      return inNewLayouts
        ? null
        : layout;
    }).filter(l => l));
    this.setState({ layouts });
  }

  render () {
    const { layersTree } = this.props;
    const { layouts } = this.state;
    const { onChange } = this;
    return (
      <div className="widget-map">
        <LayersTree
          layersTree={layersTree}
          onChange={onChange}
        />
        <Map
          layouts={layouts}
        />
      </div>
    );
  }
}

export default WidgetMap;
