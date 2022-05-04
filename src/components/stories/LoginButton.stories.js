import React from 'react';
import  { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import LoginButton from '../LoginButton/LoginButton';
import translateMock from '../../utils/translate';

import logIn from '../../images/log-in.svg';

const translate = translateMock({
  'auth.logout.confirm.label': 'Confirm logout',
  'auth.logout.cancel.button_label': 'Cancel',
  'auth.logout.confirm.button_label': 'Confirm',
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
  'auth.loginform.title': 'signin',
  'auth.signupform.email.label': 'Email',
  'auth.signupform.email.info': 'required',
  'auth.signupform.email.placeholder': 'Email',
  'auth.signupform.email.help': 'Type your email',
  'auth.signupform.submit': 'signup',
  'auth.signupform.title': 'Create an account',
});


const CustomRenderer =  () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <h1 style={{ color: 'white' }}>Custom Renderer</h1>
  </div>
);

const stories = storiesOf('Components/NavBarItem', module);
stories
  .add('LoginButton', () => (
    <LoginButton
      authenticated={boolean('authenticated', false)}
      isMobileSized={false}
      icon={logIn}
      t={translate}
      env={{}}
    />
  ))
  .add('LoginButton with form renderer', () => (
    <LoginButton
      authenticated={boolean('authenticated', false)}
      render={CustomRenderer}
      isMobileSized={false}
      icon={logIn}
      t={translate}
      env={{}}
    />
  ));
