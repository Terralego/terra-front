import React from 'react';
import { storiesOf } from '@storybook/react';

import NavBarItemDesktop from '../NavBarItemDesktop';

import logo from '../../images/defaultLogo.svg';

const stories = storiesOf('Components/NavBarItem', module);
stories
  .add('NavBarItemDesktop', () => (
    <NavBarItemDesktop
      id="42"
      label="item label"
      href="#"
      onClick={() => {}}
      icon={logo}
    />
  ));
