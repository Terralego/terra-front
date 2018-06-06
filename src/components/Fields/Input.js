import React from 'react';
import Proptypes from 'prop-types';
import { Form, Input } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }

  return '';
}

function InputField (props) {
  return (
    <Control
      model={props.model}
      id={props.model}
      validators={{
        required: val => val && val.length,
      }}
      withFieldValue
      component={innerProps => (
        <FormItem
          label={props.label}
          validateStatus={validateStatus(innerProps.fieldValue)}
          required={props.required}
          help={
            <Errors
              model={props.model}
              show={field => field.touched && !field.focus}
              messages={props.errorMessages}
            />}
        >
          <Input
            defaultValue={innerProps.value}
            placeholder={props.placeholder}
            onChange={innerProps.onChange}
            onFocus={innerProps.onFocus}
            onBlur={innerProps.onBlur}
            onKeyPress={innerProps.onKeyPress}
            autoFocus={props.autoFocus}
          />
        </FormItem>)}
    />
  );
}

InputField.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  placeholder: Proptypes.string,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  required: Proptypes.bool,
  autoFocus: Proptypes.bool,
};

InputField.defaultProps = {
  placeholder: '',
  errorMessages: {},
  required: false,
  autoFocus: false,
};

export default InputField;
