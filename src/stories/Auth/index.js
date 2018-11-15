import React from 'react';

import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import ApiProvider from './ApiProvider';
import AuthProvider from '../../modules/Auth';
import ShouldDisplayLoginForm from './ShouldDisplayLoginForm';
import CustomLoginForm from './CustomLoginForm';

const stories = storiesOf('Module Auth', module);

stories.add('Login', () => (
  <ApiProvider host={text('API Host', '')}>
    <AuthProvider>
      <ShouldDisplayLoginForm />
    </AuthProvider>
  </ApiProvider>
));

stories.add('Configure module', () => <CustomLoginForm />);
