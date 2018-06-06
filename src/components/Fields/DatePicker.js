import React from 'react';
import Proptypes from 'prop-types';
import { Form, DatePicker } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }

  return '';
}

function CustomDatePicker (props) {
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
          // style={{ display: 'inline-block' }}
          label={props.label && props.label}
          validateStatus={validateStatus(innerProps.fieldValue)}
          help={
            <Errors
              model={props.model}
              show={field => field.touched && !field.focus}
              messages={props.errorMessages}
            />}
        >
          <DatePicker
            style={props.style}
            placeholder={props.placeholder}
            onChange={innerProps.onChange}
            onFocus={innerProps.onFocus}
            onBlur={innerProps.onBlur}
            onKeyPress={innerProps.onKeyPress}
            // autoFocus={!eventEndDate}
            showTime
            format={props.format}
            // disabledDate={this.disabledStartDate}
            // onOpenChange={this.handleStartOpenChange}
          />
        </FormItem>)}
    />
  );
}

CustomDatePicker.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string,
  placeholder: Proptypes.string,
  format: Proptypes.string,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
};

CustomDatePicker.defaultProps = {
  label: null,
  placeholder: '',
  format: 'DD-MM-YYYY HH:mm',
  errorMessages: { required: 'Please fill this field' },
};

export default CustomDatePicker;
