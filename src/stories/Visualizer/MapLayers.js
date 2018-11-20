import React from 'react';
import deepmerge from 'deepmerge';
import Map from '../../modules/Visualizer/widgets/Map/components/Map';

const TREELAYOUTS = [{
  label: 'scenario 1',
  active: {
    layouts: [{
      id: 'background',
      visibility: 'visible',
    }, {
      id: 'road',
      paint: {
        'line-color': '#ff0000',
        'line-opacity': 0.2,
      },
    }],
  },
  inactive: {
    layouts: [{
      id: 'background',
      visibility: 'none',
    }, {
      id: 'road',
      paint: {
        'line-color': '#000000',
        'line-opacity': 1,
      },
    }],
  },
}, {
  label: 'scenario 2',
  active: {
    layouts: [{
      id: 'road',
      visibility: 'visible',
      paint: {
        'line-color': '#0000ff',
      },
    }, {
      id: 'waterway',
      visibility: 'none',
    }],
  },
  inactive: {
    layouts: [{
      id: 'road',
      paint: {
        'line-color': '#000000',
      },
    }, {
      id: 'waterway',
      visibility: 'visible',
    }],
  },
}, {
  label: 'scenario 3',
  active: {
    layouts: [{
      id: 'road',
      visibility: 'none',
    }],
  },
  inactive: {
    layouts: [{
      id: 'road',
      visibility: 'visible',
    }],
  },
}];

class MapLayersToggle extends React.Component {
  state = {
    treeLayouts: this.props.treeLayouts,
    layouts: [],
  }

  toggle = layout => {
    const { layouts } = layout.isActive
      ? layout.inactive
      : layout.active;
    layout.isActive = !layout.isActive; // eslint-disable-line

    const newLayouts = deepmerge(this.state.layouts, layouts);

    this.setState({
      treeLayouts: [...this.state.treeLayouts],
      layouts: newLayouts,
    });
  }

  render () {
    const { treeLayouts, layouts } = this.state;
    return (
      <div className="tf-map">
        {treeLayouts.map(layout => (
          <button
            key={layout.label}
            onClick={() => this.toggle(layout)}
          >
            {layout.isActive ? 'disable ' : 'enable '}
            {layout.label}
          </button>
        ))}
        <Map
          accessToken="pk.eyJ1IjoiaGFkcmllbmwiLCJhIjoiY2pueDgwZGhxMDVkbjN3cWx5dGlhd3p1eiJ9.FR_XylCvZZJLdB3No6Xxnw"
          styles="mapbox://styles/hadrienl/cjoplcnu821de2rs2cf0em4rw"
          center={[2.317600, 48.866500]}
          zoom={12.0}
          layouts={layouts}
        />
      </div>
    );
  }
}

export default stories => {
  stories.add('Map Layers', () => <MapLayersToggle treeLayouts={TREELAYOUTS} />);
};
