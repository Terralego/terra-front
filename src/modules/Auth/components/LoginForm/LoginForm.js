import React from 'react';
import PropTypes from 'prop-types';

import render from './LoginFormRenderer';

import './styles.css';

export class LoginForm extends React.Component {
  static propTypes = {
    render: PropTypes.func,
  };

  static defaultProps = {
    render,
  };

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
    const { render: Render } = this.props;
    const { errorLogin, errorPassword } = this.state;
    const { submit, setLogin, setPassword } = this;
    const props = {
      submit, setLogin, setPassword, errorLogin, errorPassword,
    };

    return <Render {...props} />;
  }
}

export default LoginForm;
