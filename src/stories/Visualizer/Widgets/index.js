import { storiesOf } from '@storybook/react';

import Map from './Map/Map';
import MapLayers from './Map/MapLayers';
import FlyOver from './Map/FlyOver';

import Table from './Table/Table';

const storiesMap = storiesOf('Module Visualizer/Widgets/Map', module);

storiesMap.add('Map Component', Map);
storiesMap.add('Map communicating with a simple layer tree', MapLayers);
storiesMap.add('FlyOver', FlyOver);

const storiesTable = storiesOf('Module Visualizer/Widgets/Table', module);

storiesTable.add('Table', Table);
