import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button } from 'antd';
import { updateRequestProperties } from 'modules/userRequest';

const FormItem = Form.Item;

class NormalForm extends React.Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updateRequestProperties(values);
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
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
}

const WrappedNormalLoginForm = Form.create()(NormalForm);

const StateToProps = state => ({
  properties: state.userRequest.properties,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateRequestProperties,
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(WrappedNormalLoginForm);
