import React from 'react';

import SyncMaps, { SyncedMap } from '../../../modules/Map/SyncMaps';
import Map from '../../../modules/Map/Map';

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
            accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
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
            accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
            backgroundStyle="mapbox://styles/mapbox/dark-v9"
            zoom={5}
          />
        </SyncedMap>
      </div>
    </SyncMaps>
  </div>
);
