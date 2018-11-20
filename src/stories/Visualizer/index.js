import { storiesOf } from '@storybook/react';

import addMapStories from './Map';
import addMapLayersStories from './MapLayers';

const stories = storiesOf('Map', module);

addMapStories(stories);
addMapLayersStories(stories)
