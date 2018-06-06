import React from 'react';
import Proptypes from 'prop-types';
import { Form, Radio } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }

  return '';
}

function CustomRadio (props) {
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
          <RadioGroup
            defaultValue={props.defaultValue}
            onChange={innerProps.onChange}
            onFocus={innerProps.onFocus}
            onBlur={innerProps.onBlur}
            onKeyPress={innerProps.onKeyPress}
          >
            {props.options.map(option => (
              <RadioButton value={option.value} key={`radio_${props.model}_${option.value}`}>
                {option.label}
              </RadioButton>
            ))}
          </RadioGroup>
        </FormItem>)}
    />
  );
}

CustomRadio.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  options: Proptypes.arrayOf(Proptypes.shape({
    value: Proptypes.string,
    label: Proptypes.string,
  })).isRequired,
  defaultValue: Proptypes.string.isRequired,
  required: Proptypes.bool,
};

CustomRadio.defaultProps = {
  required: false,
  errorMessages: { required: 'Please fill this field' },
};

export default CustomRadio;
