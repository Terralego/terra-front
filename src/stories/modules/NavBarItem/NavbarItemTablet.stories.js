import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';

import NavBarItemTablet from '../../../components/NavBarItemTablet';

import logo from '../../../images/defaultLogo.svg';


const stories = storiesOf('Components/NavBarItem', module);
stories
  .addDecorator(story => <MemoryRouter>{story()}</MemoryRouter>)
  .add('NavBarItemTablet', () => (
    <NavBarItemTablet
      id={42}
      label="item label"
      href="#"
      onClick={() => {}}
      icon={logo}
    />
  ));
