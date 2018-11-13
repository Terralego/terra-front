import React from 'react';
import { Card, FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';

export const LoginFormRenderer = ({
  submit, setLogin, setPassword, errorLogin, errorPassword,
}) => (
  <Card className="login-form">
    <form
      onSubmit={submit}
    >
      <FormGroup
        helperText={errorLogin ? 'Invalid email' : 'Type your email'}
        label="Email"
        labelFor="login"
        labelInfo="(required)"
        intent={errorLogin ? Intent.WARNING : null}
      >
        <InputGroup
          id="login"
          placeholder="Email"
          onChange={setLogin}
          intent={errorLogin ? Intent.WARNING : null}
          autoComplete="username"
        />
      </FormGroup>

      <FormGroup
        helperText={errorPassword ? 'Invalid password' : 'Type your password'}
        label="Password"
        labelFor="password"
        labelInfo="(required)"
        intent={errorPassword ? Intent.WARNING : null}
      >
        <InputGroup
          type="password"
          id="password"
          placeholder="Password"
          onChange={setPassword}
          intent={errorPassword ? Intent.WARNING : null}
          autoComplete="current-password"
        />
      </FormGroup>
      <Button
        type="submit"
      >
        Connexion
      </Button>
    </form>
  </Card>
);

export default LoginFormRenderer;
