import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

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
        this.props.loginUser(values);
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { isAuthenticated, location } = this.props;

    return (
      isAuthenticated ?
        <Redirect to={location.state ? location.state.from : '/'} />
        :
        <Form onSubmit={this.handleSubmit}>
          <h2>Login</h2>
          <FormItem label="Email" >
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Veuillez saisir un titre' }],
            })(<Input />)}
          </FormItem>

          <FormItem label="Password">
            {getFieldDecorator('password', {
            })(<Input type="password" />)}
          </FormItem>

          <FormItem>
            <Button type="primary" htmlType="submit" icon="arrow-right">
              Login
            </Button>
          </FormItem>
        </Form>
    );
  }
}

const FormLogin = Form.create()(Login);

const DispatchToProps = dispatch =>
  bindActionCreators({ loginUser }, dispatch);

export default connect(null, DispatchToProps)(FormLogin);
