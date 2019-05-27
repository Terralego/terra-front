import React from 'react';
import { Card, FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';

import translateMock from '../../../../utils/translate';

export const SignupFormRenderer = ({
  submit,
  setSignupProperty,
  errors: { email, password } = {},
  showPassword,
  loading,
  translate = translateMock({
    'auth.signupform.email.invalid': 'Invalid email',
    'auth.signupform.email.help': 'Type your email',
    'auth.signupform.email.label': 'Email',
    'auth.signupform.email.info': 'required',
    'auth.signupform.email.placeholder': 'Email',
    'auth.signupform.password.invalid': 'Invalid email',
    'auth.signupform.password.help': 'Type your email',
    'auth.signupform.password.label': 'Email',
    'auth.signupform.password.info': 'required',
    'auth.signupform.password.placeholder': 'Email',
    'auth.signupform.submit': 'Create account',
  }),
}) => (
  <Card className="signup-form">
    <form
      onSubmit={submit}
    >
      <FormGroup
        helperText={translate('auth.signupform.email.help')}
        label={translate('auth.signupform.email.label')}
        labelFor="email"
        labelInfo={translate('auth.signupform.email.info')}
        intent={email ? Intent.WARNING : null}
      >
        <InputGroup
          id="email"
          placeholder={translate('auth.signupform.email.placeholder')}
          onChange={setSignupProperty}
          intent={email ? Intent.WARNING : null}
          autoComplete="username"
        />
      </FormGroup>

      {showPassword && (
        <FormGroup
          helperText={translate('auth.signupform.password.help')}
          label={translate('auth.signupform.password.label')}
          labelFor="password"
          labelInfo={translate('auth.signupform.password.info')}
          intent={password ? Intent.WARNING : null}
        >
          <InputGroup
            type="password"
            id="password"
            placeholder={translate('auth.signupform.password.placeholder')}
            onChange={setSignupProperty}
            intent={password ? Intent.WARNING : null}
            autoComplete="current-password"
          />
        </FormGroup>
      )}

      <Button
        type="submit"
        disabled={loading}
      >
        {translate('auth.signupform.submit')}
      </Button>
    </form>
  </Card>
);


export default SignupFormRenderer;
