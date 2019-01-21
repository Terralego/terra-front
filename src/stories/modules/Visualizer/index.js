import { storiesOf } from '@storybook/react';

import MapView from './Map';
import InteractiveMapView from './View';
import SyncedMaps from './SyncedMaps';

const stories = storiesOf('Modules/Map/', module);

stories.add('Map', MapView);
stories.add('InteractiveMap', InteractiveMapView);
stories.add('SyncedMaps', SyncedMaps);
