import React from 'react';
import Proptypes from 'prop-types';
import { Form, Select } from 'antd';
import { Control, Errors } from 'react-redux-form';

const FormItem = Form.Item;

function validateStatus (fieldValue) {
  if (!fieldValue.valid && fieldValue.touched && !fieldValue.focus) {
    return 'error';
  }

  return '';
}

const handleFilter = (inputValue, option) => option.props.children
  .toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

function CustomSelect (props) {
  return (
    <Control.select
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
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={handleFilter}
            defaultValue={innerProps.value}
            placeholder={props.placeholder}
            onChange={innerProps.onChange}
            onFocus={innerProps.onFocus}
            onBlur={innerProps.onBlur}
            onKeyPress={innerProps.onKeyPress}
          >{props.options.map(option => (
            props.categories ?
              <Select.OptGroup key={option.value} label={option.label}>
                {option.children.map(opt => (
                  <Select.Option key={opt.value} value={`${option.value},${opt.value}`} label={opt.label} category={option.value}>
                    {opt.label}
                  </Select.Option>
                  ))}
              </Select.OptGroup>
            : <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
          ))}
          </Select>
        </FormItem>)}
    />
  );
}

CustomSelect.propTypes = {
  model: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  placeholder: Proptypes.string,
  errorMessages: Proptypes.shape({
    x: Proptypes.string,
  }),
  required: Proptypes.bool,
};

CustomSelect.defaultProps = {
  placeholder: '',
  errorMessages: {},
  required: false,
};

export default CustomSelect;
