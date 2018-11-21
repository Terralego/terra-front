import React, { Component } from 'react';
import PropTypes from 'prop-types';

import render from './SignupFormRenderer';

import './styles.css';

export class SignupForm extends Component {
  static propTypes = {
    render: PropTypes.func,
  };

  static defaultProps = {
    render,
  };

  state = {};

  setSignupProperty = ({ target: { id, value } }) => this.setState({ [id]: value });

  submit = async event => {
    event.preventDefault();
    const properties = { ...this.state };
    this.setState({
      errors: {
        ...Object.keys(this.state).reduce((acc, curr) => ({ ...acc, [curr]: false }), {}),
      },
    });

    const { signupAction } = this.props;

    try {
      await signupAction(properties);
    } catch (error) {
      if (error.data) {
        this.setState({
          errors: {
            email: !!error.data.email,
            password: !!error.data.password,
          },
        });
      }
    }
  }

  render () {
    const { render: Render } = this.props;
    const { errors } = this.state;
    const { setSignupProperty, submit } = this;

    const props = {
      setSignupProperty, submit, errors,
    };

    return (
      <Render {...props} />
    );
  }
}

export default SignupForm;
