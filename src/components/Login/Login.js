import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loginUser } from 'modules/authentication';

const FormItem = Form.Item;

class Login extends Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        this.props.loginUser(values);
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit}>

        <h2>Login</h2>

        <FormItem
          label="Email"
        >
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Veuillez saisir un titre' }],
          })(<Input />)}
        </FormItem>

        <FormItem
          label="Password"
        >
          {getFieldDecorator('password', {
          })(<Input />)}
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="arrow-right"
          >
            Login
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const FormLogin = Form.create()(Login);

const StateToProps = state => ({
  properties: state.userRequest.data.properties,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      loginUser,
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(FormLogin);
