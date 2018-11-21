import React from 'react';
import { Card, FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';

export const SignupFormRenderer = ({
  submit,
  setSignupProperty,
  errors: { email, password } = {},
}) => (
  <Card className="signup-form">
    <form
      onSubmit={submit}
    >
      <FormGroup
        helperText="Type your email"
        label="Email"
        labelFor="email"
        labelInfo="(required)"
        intent={email ? Intent.WARNING : null}
      >
        <InputGroup
          id="email"
          placeholder="Email"
          onChange={setSignupProperty}
          intent={email ? Intent.WARNING : null}
          autoComplete="username"
        />
      </FormGroup>

      <FormGroup
        helperText="Type your password"
        label="Password"
        labelFor="password"
        labelInfo="(required)"
        intent={password ? Intent.WARNING : null}
      >
        <InputGroup
          type="password"
          id="password"
          placeholder="Password"
          onChange={setSignupProperty}
          intent={password ? Intent.WARNING : null}
          autoComplete="current-password"
        />
      </FormGroup>

      <Button
        type="submit"
      >
        Inscription
      </Button>
    </form>
  </Card>
);


export default SignupFormRenderer;
