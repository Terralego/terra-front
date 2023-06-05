import React from 'react';
import PropTypes from 'prop-types';

import render from './LoginFormRenderer';

import './styles.scss';

export class LoginForm extends React.Component {
  static propTypes = {
    render: PropTypes.func,
    onAfterSubmitting: PropTypes.func,
    onBeforeSubmitting: PropTypes.func,
    ssoLink: PropTypes.string,
  };

  static defaultProps = {
    render,
    onAfterSubmitting () {},
    onBeforeSubmitting () {},
    ssoLink: undefined,
  };

  state = {};

  setLogin = ({ target: { value: login } }) => this.setState({ login });

  setPassword = ({ target: { value: password } }) => this.setState({ password });

  submit = async event => {
    const { onBeforeSubmitting, onAfterSubmitting } = this.props;
    event.preventDefault();
    this.setState({
      errorLogin: false,
      errorPassword: false,
    });

    const { authAction } = this.props;
    const { login, password } = this.state;

    onBeforeSubmitting(event);

    try {
      await authAction({ login, password });
    } catch (error) {
      if (error.data) {
        this.setState({
          errorLogin: !!error.data.email,
          errorPassword: !!error.data.password,
          errorGeneric: !error.data.email && !error.data.password,
        });
      }
    }
    onAfterSubmitting(event);
  }

  render () {
    const { render: Render, ...rest } = this.props;
    const { errorLogin, errorPassword, errorGeneric } = this.state;
    const { submit, setLogin, setPassword } = this;
    const props = {
      submit, setLogin, setPassword, errorLogin, errorPassword, errorGeneric, ...rest,
    };

    return <Render {...props} />;
  }
}

export default LoginForm;
