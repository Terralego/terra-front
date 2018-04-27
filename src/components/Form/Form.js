import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button } from 'antd';
import { addRequest } from '../../modules/base';

const FormItem = Form.Item;

class NormalForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.addRequest(values.name, values.activity);
      }
    });
  };
  render () {
    const { getFieldDecorator } = this.props.form;
    if (!this.props.request.name.length) {
      return (
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: 'Veuillez saisir votre demande !' },
              ],
            })(<Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Nom de la demande"
            />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('activity', {
              rules: [
                { required: true, message: "Veuillez saisir votre type d'actitivé !" },
              ],
            })(<Input
              prefix={
                <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
              }
              placeholder="Type d'activité"
            />)}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Valider
            </Button>
          </FormItem>
        </Form>
      );
    }
    return (
      <div>
        <div>Nom de la demande : {this.props.request.name}</div>
        <div>Type : {this.props.request.activity}</div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalForm);

const StateToProps = state => ({
  request: state.base.request,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      addRequest,
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(WrappedNormalLoginForm);
