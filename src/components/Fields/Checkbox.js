import React from 'react';
import Proptypes from 'prop-types';
import { Form, Checkbox } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }

  return '';
}

function CustomCheckbox (props) {
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
          help={
            <Errors
              model={props.model}
              show={field => field.touched && !field.focus}
              messages={props.errorMessages}
            />}
        >
          <CheckboxGroup
            options={props.options}
            placeholder={props.placeholder}
            onChange={innerProps.onChange}
            onFocus={innerProps.onFocus}
            onBlur={innerProps.onBlur}
            onKeyPress={innerProps.onKeyPress}
          />
        </FormItem>)}
    />
  );
}

CustomCheckbox.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  placeholder: Proptypes.string,
  errorMessages: Proptypes.shape({
    required: Proptypes.string,
  }),
};

CustomCheckbox.defaultProps = {
  placeholder: '',
  errorMessages: { required: 'Please fill this field' },
};

export default CustomCheckbox;
