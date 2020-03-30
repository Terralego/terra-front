import React from 'react';
import { storiesOf } from '@storybook/react';

import HeaderButton from '../../../components/HeaderButton';

import sign from '../../../images/info-sign.svg';

const stories = storiesOf('Components/Header', module);
stories.add('HeaderButton', () => (
  <HeaderButton
    id={1}
    icon={sign}
    alt="header button"
  />
));
