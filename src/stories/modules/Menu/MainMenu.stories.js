import React from 'react';
import { storiesOf } from '@storybook/react';
import { Icon } from '@blueprintjs/core';

import MainMenu from '../../../components/MainMenu';

import login from '../../../images/log-in.svg';
import './styles.scss';

// eslint-disable-next-line no-alert
const handleClick = () => alert('it works');

const stories = storiesOf('Components/Menu', module);
stories
  .add('MainMenu | default', () => (
    <MainMenu
      navItems={[[
        { label: 'log in', icon: login, id: 'login' },
        { label: 'log out', icon: 'log-out', id: 'logout' },
        { label: 'info sign', icon: <Icon icon="info-sign" />, id: 'infosign' },
        { label: 'Close', id: 'close' },
      ]]}
    />
  ))
  .add('MainMenu | custom', () => (
    <MainMenu
      navItems={[[
        { component: () => <button type="button" onClick={handleClick}>click me</button>, id: 'customComponent1' },
        { component: () => <img style={{ marginLeft: '10px' }} src={login} alt="login logo" />, id: 'customComponent2' },
        { component: () => <div style={{ marginLeft: '10px' }}>check me<input type="checkbox" /></div>, id: 'customComponent3' },
        { component: () => <div style={{ marginLeft: '10px' }}>search me<input type="text" /></div>, id: 'customComponent4' },
      ]]}
    />
  ));
