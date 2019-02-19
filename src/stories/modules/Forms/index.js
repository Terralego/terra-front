import React from 'react';
import { storiesOf } from '@storybook/react';

import Filters from './Filters';

const stories = storiesOf('Modules/Filters', module);

stories.add('Show form filters with specific layer', () => <Filters />);
