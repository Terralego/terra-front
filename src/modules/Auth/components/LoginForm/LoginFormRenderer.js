import React from 'react';
import { Card, FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';

import translateMock from '../../../../utils/translate';

export const LoginFormRenderer = ({
  submit, setLogin, setPassword, errorLogin, errorPassword,
  translate = translateMock({
    'auth.loginform.email.invalid': 'Invalid email',
    'auth.loginform.email.help': 'Type your email',
    'auth.loginform.email.label': 'Email',
    'auth.loginform.email.info': 'required',
    'auth.loginform.email.placeholder': 'Email',
    'auth.loginform.password.invalid': 'Invalid password',
    'auth.loginform.password.help': 'Type your password',
    'auth.loginform.password.label': 'Password',
    'auth.loginform.password.info': 'required',
    'auth.loginform.password.placeholder': 'Password',
    'auth.loginform.submit': 'Signin',
  }),
}) => (
  <Card className="login-form">
    <form
      onSubmit={submit}
    >
      <FormGroup
        helperText={translate(`auth.loginform.email.${errorLogin ? 'invalid' : 'help'}`)}
        label={translate('auth.loginform.email.label')}
        labelFor="login"
        labelInfo={translate('auth.loginform.email.info')}
        intent={errorLogin ? Intent.WARNING : null}
      >
        <InputGroup
          id="login"
          placeholder={translate('auth.loginform.email.placeholder')}
          onChange={setLogin}
          intent={errorLogin ? Intent.WARNING : null}
          autoComplete="username"
        />
      </FormGroup>

      <FormGroup
        helperText={translate(`auth.loginform.password.${errorPassword ? 'invalid' : 'help'}`)}
        label={translate('auth.loginform.password.label')}
        labelFor="password"
        labelInfo={translate('auth.loginform.password.info')}
        intent={errorPassword ? Intent.WARNING : null}
      >
        <InputGroup
          type="password"
          id="password"
          placeholder={translate('auth.loginform.password.placeholder')}
          onChange={setPassword}
          intent={errorPassword ? Intent.WARNING : null}
          autoComplete="current-password"
        />
      </FormGroup>
      <Button
        type="submit"
      >
        {translate('auth.loginform.submit')}
      </Button>
    </form>
  </Card>
);

export default LoginFormRenderer;
