import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text } from '@storybook/addon-knobs';

import { ApiProvider } from '../../Api';
import AuthProvider, { LoginForm, SignupForm } from '..';
import LoginFormPure from '../components/LoginForm/LoginForm';
import SignupFormPure from '../components/SignupForm/SignupForm';
import SSOLoginFormRenderer from '../components/LoginForm/SSOLoginFormRenderer';

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

const mockedTranslate = translateKey => {
  const translations = {
    'auth.loginform.renderer.sso': 'SSO Connection',
    'auth.loginform.renderer.internal': 'Internal authentication',
    'auth.loginform.renderer.separator': 'or',
    'auth.loginform.email.helper': 'Type your email',
    'auth.loginform.email.helper_invalid': 'Invalid email',
    'auth.loginform.email.label': 'Email',
    'auth.loginform.email.info': 'required',
    'auth.loginform.email.placeholder': 'Email',
    'auth.loginform.password.helper': 'Type your password',
    'auth.loginform.password.helper_invalid': 'Invalid password',
    'auth.loginform.password.label': 'Password',
    'auth.loginform.password.info': 'required',
    'auth.loginform.password.placeholder': 'Password',
    'auth.loginform.submit': 'Signin',
    'auth.loginform.error_generic': 'Invalid credentials',
  };
  return translations[translateKey];
};

stories.add('SSO Signin', () => (
  <ApiProvider host={text('api host', '')}>
    <AuthProvider>
      <LoginForm
        translate={mockedTranslate}
        render={SSOLoginFormRenderer}
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
