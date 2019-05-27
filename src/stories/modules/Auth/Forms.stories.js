import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import AuthProvider, { LoginForm, SignupForm } from '../../../modules/Auth';
import LoginFormPure from '../../../modules/Auth/components/LoginForm/LoginForm';
import SignupFormPure from '../../../modules/Auth/components/SignupForm/SignupForm';

import loginDoc from './login.md';
import signupDoc from './signup.md';

AuthProvider.displayName = 'AuthProvider';
LoginForm.displayName = 'LoginForm';
LoginFormPure.displayName = 'LoginForm';
SignupForm.displayName = 'SignupForm';
SignupFormPure.displayName = 'SignupForm';

storiesOf('Modules/Auth/Forms', module).add('Signin', () => (
  <AuthProvider>
    <LoginForm />
  </AuthProvider>
), {
  info: {
    text: loginDoc,
    propTables: [LoginFormPure],
  },
});

storiesOf('Modules/Auth/Forms', module).add('Signup', () => (
  <AuthProvider>
    <SignupForm
      showPassword={boolean('Show password', true)}
    />
  </AuthProvider>
), {
  info: {
    text: signupDoc,
    propTables: [SignupFormPure],
  },
});
