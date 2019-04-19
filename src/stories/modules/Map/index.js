import { storiesOf } from '@storybook/react';

import InteractiveMap from './InteractiveMap';
import SyncedMaps from './SyncedMaps';
import MapWithCluster from './MapWithCluster';

const stories = storiesOf('Modules/Map/', module);

stories.add('InteractiveMap', InteractiveMap);
stories.add('SyncedMaps', SyncedMaps);
stories.add('Map with cluster', MapWithCluster);
