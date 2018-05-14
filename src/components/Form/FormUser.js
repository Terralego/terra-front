import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateRequestValue, updateRequestProperties } from 'modules/userRequest';

const FormItem = Form.Item;

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Activity extends Component {
  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updateRequestValue('step', 1);
        this.props.updateRequestProperties(values);
      }
    });
  }

  /**
   * Is there any activity matching to params category
   * @param  {string} category
   * @returns boolean
   */
  isCategorySelected (category) {
    const values = this.props.form.getFieldValue('activities');
    return values ? values.find(activity => activity.category === category) : false;
  }

  render () {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { properties } = this.props;

    // Only show error after a field is touched.
    const nameError = isFieldTouched('name') && getFieldError('name');
    const firstNameError = isFieldTouched('firstName') && getFieldError('firstName');

    return (
      <Form onSubmit={this.handleSubmit}>

        <h2>Identification</h2>

        <FormItem
          label="Nom"
          validateStatus={nameError ? 'error' : ''}
          help={nameError || ''}
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Veuillez saisir le nom' }],
            initialValue: properties.name,
          })(<Input placeholder="Votre nom" />)}
        </FormItem>

        <FormItem
          label="Prénom"
          validateStatus={firstNameError ? 'error' : ''}
          help={firstNameError || ''}
        >
          {getFieldDecorator('firstName', {
            rules: [{ required: true, message: 'Veuillez saisir le prénom' }],
            initialValue: properties.firstName,
          })(<Input placeholder="Votre prénom" autosize={{ minRows: 3 }} />)}
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
            icon="arrow-right"
          >
            Valider
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const FormActivity = Form.create()(Activity);

const StateToProps = state => ({
  properties: state.userRequest.properties,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateRequestValue,
      updateRequestProperties,
    },
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(FormActivity);
