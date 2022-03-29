import React from 'react';
import { storiesOf } from '@storybook/react';

import NavBarItemTablet from '../NavBarItemTablet';

import logo from '../../images/defaultLogo.svg';

const stories = storiesOf('Components/NavBarItem', module);
stories
  .add('NavBarItemTablet', () => (
    <NavBarItemTablet
      id="42"
      label="item label"
      href="#"
      onClick={() => {}}
      icon={logo}
    />
  ));
