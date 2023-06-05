import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text } from '@storybook/addon-knobs';

import { ApiProvider } from '../../Api';
import AuthProvider, { LoginForm, SignupForm } from '..';
import LoginFormPure from '../components/LoginForm/LoginForm';
import SignupFormPure from '../components/SignupForm/SignupForm';

import loginDoc from './login.md';
import signupDoc from './signup.md';

AuthProvider.displayName = 'AuthProvider';
LoginForm.displayName = 'LoginForm';
LoginFormPure.displayName = 'LoginForm';
SignupForm.displayName = 'SignupForm';
SignupFormPure.displayName = 'SignupForm';

const stories = storiesOf('Components/Forms', module);

stories.add('Signin', () => (
  <ApiProvider host={text('api host', '')}>
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  </ApiProvider>
), {
  info: {
    text: loginDoc,
    propTables: [LoginFormPure],
  },
});

stories.add('Signin with SSO link', () => (
  <ApiProvider host={text('api host', '')}>
    <AuthProvider>
      <LoginForm
        ssoLink="https://example.tld"
        ssoLinkLabel="SSO"
      />
    </AuthProvider>
  </ApiProvider>
), {
  info: {
    text: loginDoc,
    propTables: [LoginFormPure],
  },
});

stories.add('Signup', () => (
  <ApiProvider host={text('api host', '')}>
    <AuthProvider>
      <SignupForm
        showPassword={boolean('Show password', true)}
      />
    </AuthProvider>
  </ApiProvider>
), {
  info: {
    text: signupDoc,
    propTables: [SignupFormPure],
  },
});
