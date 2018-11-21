import React from 'react';
import WidgetMap from '../../modules/Visualizer/widgets/Map/WidgetMap';

const LAYERSTREE = [{
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

class LayersTree extends React.Component {
  toggle = layer => {
    const { onChange } = this.props;
    const stylesToApply = layer.isActive
      ? layer.inactive
      : layer.active;
    layer.isActive = !layer.isActive; // eslint-disable-line
    onChange(stylesToApply);
  }

  render () {
    const { layersTree } = this.props;

    return (
      <>
        {layersTree.map(layer => (
          <button
            key={layer.label}
            onClick={() => this.toggle(layer)}
          >
            {layer.isActive ? 'disable ' : 'enable '}
            {layer.label}
          </button>
        ))}
      </>
    );
  }
}

export default stories => {
  stories.add('WidgetMap', () => (
    <div className="tf-map">
      <WidgetMap
        LayersTreeComponent={LayersTree}
        layersTree={LAYERSTREE}
        accessToken="pk.eyJ1IjoiaGFkcmllbmwiLCJhIjoiY2pueDgwZGhxMDVkbjN3cWx5dGlhd3p1eiJ9.FR_XylCvZZJLdB3No6Xxnw"
        styles="mapbox://styles/hadrienl/cjoplcnu821de2rs2cf0em4rw"
        center={[2.317600, 48.866500]}
        zoom={12.0}
        style={{ height: '90vh' }}
      />
    </div>
  ));
};
