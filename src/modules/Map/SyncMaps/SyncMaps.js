import React from 'react';
import syncMove from '@mapbox/mapbox-gl-sync-move';

export const context = React.createContext();

const { Provider } = context;

export class SyncMaps extends React.Component {
  maps = [];

  addMap = map => {
    this.maps.push(map);
    if (this.maps.length < 2) return;
    syncMove(...this.maps);
  }

  render () {
    const { children } = this.props;
    const { addMap } = this;
    const value = {
      addMap,
    };

    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}
export default SyncMaps;
