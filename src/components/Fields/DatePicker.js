import React from 'react';
import moment from 'moment';
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
          style={{ display: 'inline-block' }}
          label={props.label && props.label}
          validateStatus={validateStatus(innerProps.fieldValue)}
          required={props.required}
          help={
            <Errors
              model={props.model}
              show={field => field.touched && !field.focus}
              messages={props.errorMessages}
            />}
        >
          <DatePicker
            style={props.style}
            defaultValue={moment()}
            placeholder={props.placeholder}
            onChange={innerProps.onChange}
            onFocus={innerProps.onFocus}
            onBlur={innerProps.onBlur}
            onKeyPress={innerProps.onKeyPress}
            autoFocus={props.autoFocus}
            // open={props.open}
            showTime
            format={props.format}
            disabledDate={props.disabledDate}
            onOpenChange={props.onOpenChange}
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
  required: Proptypes.bool,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  autoFocus: Proptypes.oneOfType([
    Proptypes.bool,
    Proptypes.func,
  ]),
  // open: Proptypes.oneOfType([
  //   Proptypes.bool,
  //   Proptypes.func,
  // ]),
  disabledDate: Proptypes.oneOfType([
    Proptypes.bool,
    Proptypes.func,
  ]),
  onOpenChange: Proptypes.func,
};

CustomDatePicker.defaultProps = {
  label: null,
  placeholder: '',
  format: 'DD-MM-YYYY HH:mm',
  errorMessages: { required: 'Please fill this field' },
  required: false,
  autoFocus: false,
  // open: false,
  disabledDate: false,
  onOpenChange: () => {},
};

export default CustomDatePicker;
