import React from 'react';
import  { storiesOf } from '@storybook/react';

import translateMock from '../../../utils/translate';

import SideBySideImages from '../../../modules/Picture/compare/SideBySideImages';
import img1 from './picture1.png';

const picture1 = { file: { full: img1 } };
const translate = translateMock({ 'pictures.compare.placeholder': 'The picture is missing.' });

const stories = storiesOf('Components/ImageCompare', module);
stories.add('SideBySideImages with two pictures', () => (
  <div style={{ height: '500px' }}>
    <SideBySideImages pictures={[picture1, picture1]} scale={1} translate={translate} />
  </div>
));
stories.add('SideBySideImages with one picture', () => (
  <div style={{ height: '500px' }}>
    <SideBySideImages pictures={[picture1]} translate={translate} />
  </div>
));
stories.add('SideBySideImages with one  picture corrupt missing', () => (
  <div style={{ height: '500px' }}>
    <SideBySideImages pictures={[picture1, {}]} translate={translate} />
  </div>
));
