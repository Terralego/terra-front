import React from 'react';

import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import ApiProvider from './ApiProvider';
import AuthProvider, { LoginForm, Authenticated } from '../../modules/Auth';

const stories = storiesOf('Auth', module);

stories.add('Login', () => (
  <ApiProvider host={text('API Host', '')}>
    <AuthProvider>
      <Authenticated>
        {({ authenticated, signoutAction }) => (authenticated
          ? <>
            <p>Welcome !</p>
            <button onClick={signoutAction}>Logout</button>
            </>
          : <LoginForm />)
        }
      </Authenticated>
    </AuthProvider>
  </ApiProvider>
));
