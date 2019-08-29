import { storiesOf } from '@storybook/react';

import MapWithCluster from './MapWithCluster';
import SyncedMaps from './SyncedMaps';

storiesOf('Map components/SyncedMaps', module).add('SyncedMaps', SyncedMaps);
storiesOf('Map components/InteractiveMap', module).add('With clusters', MapWithCluster);
