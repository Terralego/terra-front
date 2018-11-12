import React from 'react';
import { Card, FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core';

import { Consumer } from '../../services/context';

import './styles.css';

export class LoginForm extends React.Component {
  state = {};

  setLogin = ({ target: { value: login } }) => this.setState({ login });
  setPassword = ({ target: { value: password } }) => this.setState({ password });

  submit = async event => {
    event.preventDefault();
    this.setState({
      errorLogin: false,
      errorPassword: false,
    });

    const { authAction } = this.props;
    const { login, password } = this.state;

    try {
      await authAction({ login, password });
    } catch (error) {
      if (error.data) {
        this.setState({
          errorLogin: !!error.data.email,
          errorPassword: !!error.data.password,
        });
      }
    }
  }

  render () {
    const { submit, setLogin, setPassword } = this;
    const { errorLogin, errorPassword } = this.state;

    return (
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
  }
}

export default props => (
  <Consumer>
    {({ authAction }) => (
      <LoginForm
        authAction={authAction}
        {...props}
      />
    )}
  </Consumer>
);
