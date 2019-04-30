import { storiesOf } from '@storybook/react';

import MapWithCluster from './MapWithCluster';
import SyncedMaps from './SyncedMaps';

const stories = storiesOf('Modules/Map/', module);

stories.add('SyncedMaps', SyncedMaps);
stories.add('Map with cluster', MapWithCluster);
