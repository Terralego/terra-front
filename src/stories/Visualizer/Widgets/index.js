import { storiesOf } from '@storybook/react';

import Map from './Map';
import MapLayers from './MapLayers';

const stories = storiesOf('Module Visualizer/Widgets/Map');

stories.add('Map Component', Map);
stories.add('Map communicating with a simple layer tree', MapLayers);
