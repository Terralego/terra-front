import React from 'react';
import { storiesOf } from '@storybook/react';

import HeaderLink from '../../../components/HeaderLink';

const stories = storiesOf('Components/Header', module);
stories
  .add('HeaderLink', () => (
    <HeaderLink href="#">HeaderLink component</HeaderLink>
  ));
