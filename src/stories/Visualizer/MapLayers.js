import React from 'react';
import Map from '../../modules/Visualizer/widgets/Map/components/Map';

class MapLayersToggle extends React.Component {
  state = {
    layouts: [],
  }

  displayLayout1 = () => this.setState({
    layouts: [{
      id: 'background',
      visibility: 'none',
    }, {
      id: 'road',
      visibility: 'none',
    }, {
      id: 'waterway',
      visibility: 'visible',
    }],
  });

  displayLayout2 = () => this.setState({
    layouts: [{
      id: 'background',
      visibility: 'visible',
    }, {
      id: 'road',
      visibility: 'none',
    }, {
      id: 'waterway',
      visibility: 'none',
    }],
  });

  displayLayout3 = () => this.setState({
    layouts: [{
      id: 'background',
      visibility: 'none',
    }, {
      id: 'road',
      visibility: 'visible',
    }, {
      id: 'waterway',
      visibility: 'none',
    }],
  });

  render () {
    const { layouts } = this.state;
    return (
      <div className="tf-map">
        <button onClick={this.displayLayout1}>Layout 1</button>
        <button onClick={this.displayLayout2}>Layout 3</button>
        <button onClick={this.displayLayout3}>Layout 3</button>
        <Map
          accessToken="pk.eyJ1IjoiaGFkcmllbmwiLCJhIjoiY2pueDgwZGhxMDVkbjN3cWx5dGlhd3p1eiJ9.FR_XylCvZZJLdB3No6Xxnw"
          style="mapbox://styles/hadrienl/cjoplcnu821de2rs2cf0em4rw"
          center={[2.317600, 48.866500]}
          zoom={12.0}
          layouts={layouts}
        />
      </div>
    );
  }
}

export default stories => {
  stories.add('Map Layers', () => <MapLayersToggle />);
}
