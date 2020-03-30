import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';

import NavBarItemDesktop from '../../../components/NavBarItemDesktop';

import logo from '../../../images/defaultLogo.svg';

const stories = storiesOf('Components/NavBarItem', module);
stories
  .addDecorator(story => <MemoryRouter>{story()}</MemoryRouter>)
  .add('NavBarItemDesktop', () => (
    <NavBarItemDesktop
      id={42}
      label="item label"
      href="#"
      onClick={() => {}}
      icon={logo}
    />
  ));
