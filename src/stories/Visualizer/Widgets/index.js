import { storiesOf } from '@storybook/react';

import Map from './Map/Map';
import MapLayers from './Map/MapLayers';
import FlyOver from './Map/FlyOver';

const stories = storiesOf('Module Visualizer/Widgets/Map', module);

stories.add('Map Component', Map);
stories.add('Map communicating with a simple layer tree', MapLayers);
stories.add('FlyOver', FlyOver);
