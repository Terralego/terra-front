import React from 'react';

import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import ApiProvider from './ApiProvider';
import AuthProvider, { LoginForm, Authenticated } from '../../modules/Auth';
import CustomLoginForm from './CustomLoginForm';


const stories = storiesOf('Module Auth', module);

stories.add('Login', () => (
  <ApiProvider host={text('API Host', '')}>
    <AuthProvider>
      <Authenticated>
        {({ authenticated, logoutAction }) => (authenticated
          ? <>
            <p>Welcome !</p>
            <button onClick={logoutAction}>Logout</button>
            </>
          : <LoginForm />)
        }
      </Authenticated>
    </AuthProvider>
  </ApiProvider>
));

stories.add('Configure module', () => <CustomLoginForm />);
