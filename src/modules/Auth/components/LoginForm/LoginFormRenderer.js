import React from 'react';
import { Card, FormGroup, InputGroup, Button, Intent, Callout } from '@blueprintjs/core';

import translateMock from '../../../../utils/translate';


export const LoginFormRenderer = ({
  submit, setLogin, setPassword, errorLogin, errorPassword, errorGeneric, ssoLink, ssoLinkLabel,
  translate = translateMock({
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
  }),
}) => (
  <Card className="login-form">
    {errorGeneric && (
      <Callout className="login-form__callout" intent={Intent.DANGER}>
        {translate('auth.loginform.error_generic')}
      </Callout>
    )}
    <form
      onSubmit={submit}
    >
      <FormGroup
        helperText={translate('auth.loginform.email.helper', { context: errorLogin ? 'invalid' : 'help' })}
        label={translate('auth.loginform.email.label')}
        labelFor="login"
        labelInfo={translate('auth.loginform.email.info')}
        intent={errorLogin ? Intent.WARNING : null}
      >
        <InputGroup
          type="email"
          id="login"
          placeholder={translate('auth.loginform.email.placeholder')}
          onChange={setLogin}
          intent={errorLogin ? Intent.WARNING : null}
          autoComplete="username"
        />
      </FormGroup>

      <FormGroup
        helperText={translate('auth.loginform.password.helper', { context: errorPassword ? 'invalid' : 'help' })}
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
      <div className="login-form__actions">
        <Button
          type="submit"
        >
          {translate('auth.loginform.submit')}
        </Button>
        {ssoLink && (
          <Button type="button" onClick={() => { window.location.pathname = ssoLink; }}>
            {ssoLinkLabel || translate('auth.loginform.sso')}
          </Button>
        )}
      </div>
    </form>
  </Card>
);

export default LoginFormRenderer;
