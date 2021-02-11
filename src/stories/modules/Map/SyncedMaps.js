import React from 'react';

import SyncMaps, { SyncedMap } from '../../../modules/Map/SyncMaps';
import Map from '../../../modules/Map/Map';

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default () => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <SyncMaps>
      <div
        style={{
          width: '50%',
          height: '100%',
          display: 'inline-block',
        }}
      >
        <SyncedMap>
          <Map
            accessToken={accessToken}
            backgroundStyle="mapbox://styles/mapbox/light-v9"
            zoom={5}
          />
        </SyncedMap>
      </div>
      <div
        style={{
          width: '50%',
          height: '100%',
          display: 'inline-block',
        }}
      >
        <SyncedMap>
          <Map
            accessToken={accessToken}
            backgroundStyle="mapbox://styles/mapbox/dark-v9"
            zoom={5}
          />
        </SyncedMap>
      </div>
    </SyncMaps>
  </div>
);
