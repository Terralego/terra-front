import React from 'react';
import  { storiesOf } from '@storybook/react';

import SideBySideImages from '../../../modules/Picture/compare/SideBySideImages';

import img1 from './picture1.png';

const picture1 = { file: { full: img1 } };

const stories = storiesOf('Components/ImageCompare', module);
stories.add('SideBySideImages with two pictures', () => (
  <div style={{ height: '500px' }}>
    <SideBySideImages pictures={[picture1, picture1]} scale={1} />
  </div>
));
stories.add('SideBySideImages with one picture', () => (
  <div style={{ height: '500px' }}>
    <SideBySideImages pictures={[picture1]} />
  </div>
));
