import React from 'react';

import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import ApiProvider from './ApiProvider';
import AuthProvider, { SignupForm } from '../../../modules/Auth';
import ShouldDisplayLoginForm from './ShouldDisplayLoginForm';
import CustomLoginForm from './CustomLoginForm';
import CustomSignupForm from './CustomSignupForm';

const stories = storiesOf('Modules/Auth', module);

stories.add('Login form', () => (
  <ApiProvider host={text('API Host', '')}>
    <AuthProvider>
      <ShouldDisplayLoginForm />
    </AuthProvider>
  </ApiProvider>
));

stories.add('Custom Login form', () => <CustomLoginForm />);

stories.add('Signup form', () => (
  <ApiProvider host={text('API Host', '')}>
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  </ApiProvider>
));

stories.add('Custom Signup form', () => <CustomSignupForm />);
