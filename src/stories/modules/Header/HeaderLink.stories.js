import React from 'react';
import { MemoryRouter } from 'react-router';
import { storiesOf } from '@storybook/react';

import HeaderLink from '../../../components/HeaderLink';

const stories = storiesOf('Components/Header', module);
stories
  .addDecorator(story => <MemoryRouter>{story()}</MemoryRouter>)
  .add('HeaderLink', () => (
    <HeaderLink href="#">HeaderLink component</HeaderLink>
  ));
