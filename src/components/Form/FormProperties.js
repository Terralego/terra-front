import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { updateRequestValue, updateRequestProperties } from 'modules/userRequest';

const FormItem = Form.Item;

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Properties extends Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit (e) {
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
    const titleError = isFieldTouched('title') && getFieldError('title');
    const descriptionError = isFieldTouched('description') && getFieldError('description');

    return (
      <Form onSubmit={this.handleSubmit}>

        <h2>Projet</h2>

        <FormItem
          label="Titre"
          validateStatus={titleError ? 'error' : ''}
          help={titleError || ''}
        >
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Veuillez saisir un titre' }],
            initialValue: properties.title,
          })(<Input placeholder="Donnez un titre à votre projet" />)}
        </FormItem>

        <FormItem
          label="Description"
          validateStatus={descriptionError ? 'error' : ''}
          help={descriptionError || ''}
        >
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Veuillez saisir une description' }],
            initialValue: properties.description,
          })(<Input placeholder="Décrivez votre projet" autosize={{ minRows: 3 }} />)}
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

const FormProperties = Form.create()(Properties);

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

export default connect(StateToProps, DispatchToProps)(FormProperties);
