import { storiesOf } from '@storybook/react';

import MapView from './Map';
import InteractiveMapView from './View';

const stories = storiesOf('Modules/Map/', module);

stories.add('Map', MapView);
stories.add('InteractiveMap', InteractiveMapView);
