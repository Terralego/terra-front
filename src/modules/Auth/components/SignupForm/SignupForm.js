import React from 'react';
import PropTypes from 'prop-types';

import render from './SignupFormRenderer';

import './styles.css';

export class SignupForm extends React.Component {
  static propTypes = {
    render: PropTypes.func,
    showPassword: PropTypes.bool,
    onCreate: PropTypes.func,
  };

  static defaultProps = {
    render,
    showPassword: true,
    onCreate () {},
  };

  state = {};

  setSignupProperty = ({ target: { id, value } }) => this.setState({ [id]: value });

  submit = async event => {
    event.preventDefault();
    const { onCreate } = this.props;
    const properties = { ...this.state };
    this.setState(state => ({
      errors: {
        ...Object.keys(state).reduce((acc, curr) => ({ ...acc, [curr]: false }), {}),
      },
      loading: true,
    }));

    const { signupAction } = this.props;

    try {
      await signupAction(properties);
      this.setState({
        done: true,
      });
      onCreate();
    } catch (error) {
      if (error.data) {
        this.setState({
          errors: {
            email: !!error.data.email,
            password: !!error.data.password,
          },
          loading: false,
        });
      }
    }
  }

  render () {
    const { render: Render, ...rest } = this.props;
    const { errors, done, loading } = this.state;
    const { setSignupProperty, submit } = this;

    const props = {
      setSignupProperty, submit, errors, done, loading, ...rest,
    };

    return (
      <Render {...props} />
    );
  }
}

export default SignupForm;
