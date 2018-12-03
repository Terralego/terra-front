import { storiesOf } from '@storybook/react';

import Map from './Map/Map';
import MapLayers from './Map/MapLayers';
import FlyOver from './Map/FlyOver';

import Table from './Table/Table';
import Header from './Table/Header';
import FullTable from './Table/FullTable';

const storiesMap = storiesOf('Modules/Visualizer/Widgets/Map', module);

storiesMap.add('Map Component', Map);
storiesMap.add('Map communicating with a simple layer tree', MapLayers);
storiesMap.add('FlyOver', FlyOver);

const storiesTable = storiesOf('Modules/Visualizer/Widgets/Table', module);

storiesTable.add('Table Component', Table);
storiesTable.add('Header', Header);
storiesTable.add('Full Table', FullTable);
