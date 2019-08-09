import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import LayersTreeProvider from '../../../modules/Visualizer/LayersTree/LayersTreeProvider';
import LayersTreeSingle, { LayersTree as ConnectedLayersTree, connectLayersTree } from '../../../modules/Visualizer/LayersTree';
import LayersTree from '../../../modules/Visualizer/LayersTree/LayersTree';
import layersTreeConfig from './layersTree';

LayersTreeSingle.displayName = 'LayersTree';
LayersTree.displayName = 'LayersTree';

const onChange = layersTreeState => {
  const title = 'Update LayersTree state';
  // eslint-disable-next-line no-console
  console.log(title, layersTreeState);
  action(title)(Array.from(layersTreeState));
};
const waitForIt = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const fetchPropertyValues = async (layer, { property }) => {
  // eslint-disable-next-line no-console
  console.log(`fetching property ${property} Values`);
  await waitForIt(2000);
  return Array.from(new Array(42), (v, k) => `${k}`);
};

const fetchPropertyRange = async (layer, { property }) => {
  // eslint-disable-next-line no-console
  console.log(`fetching property ${property} Values`);
  await waitForIt(2000);
  return { min: 42, max: 4200 };
};

storiesOf('LayersTree', module).add('Main component', () => (
  <div style={{
    maxWidth: '20rem',
  }}
  >
    <div style={{
      backgroundColor: '#44535F',
    }}
    >
      <LayersTreeSingle
        onChange={onChange}
        layersTree={layersTreeConfig}
        fetchPropertyValues={fetchPropertyValues}
        fetchPropertyRange={fetchPropertyRange}
      />
    </div>
  </div>
), {
  info: {
    propTables: [LayersTreeProvider],
    propTablesExclude: [LayersTreeSingle],
  },
});

const Debug = connectLayersTree('layersTreeState')(({ layersTreeState }) => (
  <pre>{JSON.stringify(Array.from(layersTreeState), null, 2)}</pre>
));
Debug.displayName = 'connect(\'layersTreeState\')(Debug)';
storiesOf('LayersTree', module).add('LayersTreeProvider', () => (
  <LayersTreeProvider
    layersTree={layersTreeConfig}
    fetchPropertyValues={fetchPropertyValues}
    fetchPropertyRange={fetchPropertyRange}
  >
    <div style={{
      display: 'flex',
      maxHeight: '100%',
    }}
    >
      <div style={{
        backgroundColor: '#30404d',
        flex: 1,
        maxWidth: '30rem',
      }}
      >
        <ConnectedLayersTree />
      </div>
      <div style={{
        maxHeight: '100vh',
        overflow: 'auto',
      }}
      >
        <Debug />
      </div>
    </div>
  </LayersTreeProvider>
), {
  info: {
    propTables: [LayersTreeProvider, LayersTree],
    propTablesExclude: [Debug],
  },
});
