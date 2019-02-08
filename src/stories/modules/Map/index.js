import { storiesOf } from '@storybook/react';

import MapView from './Map';
import InteractiveMap from './InteractiveMap';
import SyncedMaps from './SyncedMaps';

const stories = storiesOf('Modules/Map/', module);

stories.add('Map', MapView);
stories.add('InteractiveMap', InteractiveMap);
stories.add('SyncedMaps', SyncedMaps);
