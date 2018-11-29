import { storiesOf } from '@storybook/react';

import Map from './Map';
import MapLayers from './MapLayers';
import FlyOver from './FlyOver';

const stories = storiesOf('Module Visualizer/Widgets/Map', module);

stories.add('Map Component', Map);
stories.add('Map communicating with a simple layer tree', MapLayers);
stories.add('FlyOver', FlyOver);
