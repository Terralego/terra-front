import React from 'react';
import { storiesOf } from '@storybook/react';

import MainMenu from '../../../components/MainMenu';

import login from '../../../images/log-in.svg';
import logout from '../../../images/log-out.svg';
import infosign from '../../../images/info-sign.svg';

const stories = storiesOf('Components/Menu', module);
stories
  .add('MainMenu | default', () => (
    <MainMenu
      navItems={[[
        { label: 'log in', icon: login, id: 'login' },
        { label: 'log out', icon: logout, id: 'logout' },
        { label: 'info sign', icon: infosign, id: 'ingosign' },
      ]]}
    />
  ))
  .add('MainMenu | custom', () => (
    <MainMenu
      navItems={[[
        { component: () => <button type="button">click me</button> },
        { component: () => <img style={{ marginLeft: '10px' }} src={login} alt="login logo" /> },
        { component: () => <div style={{ marginLeft: '10px' }}>check me<input type="checkbox" /></div> },
        { component: () => <div style={{ marginLeft: '10px' }}>search me<input type="text" /></div> },
      ]]}
    />
  ));
