import React from 'react';

import PropTypes from 'prop-types';

import { FormGroup } from '@blueprintjs/core';
import { DateRangeInput as BPDateRangeInput } from '@blueprintjs/datetime';

// Date Format
const formatDate = date => date.toLocaleDateString();
const parseDate = str => new Date(str);

// Date Error Message
const DEFAULT_OVERLAPPING_DATES_MESSAGE = 'Overlapping date';
const DEFAULT_INVALID_DATE_MESSAGE = 'Invalid date';

export const DateRangeInput = ({
  className,
  label,
  value,
  onChange,
  locales: { overlappingDatesMessage, invalidDateMessage },
  ...props
}) => (
  <FormGroup
    label={label}
  >
    <BPDateRangeInput
      className={className}
      formatDate={formatDate}
      onChange={onChange}
      parseDate={parseDate}
      value={value}
      overlappingDatesMessage={overlappingDatesMessage || DEFAULT_OVERLAPPING_DATES_MESSAGE}
      invalidDateMessage={invalidDateMessage || DEFAULT_INVALID_DATE_MESSAGE}
      {...props}
    />
  </FormGroup>
);

DateRangeInput.propTypes = {
  locales: PropTypes.shape({
    overlappingDatesMessage: PropTypes.string,
    invalidDateMessage: PropTypes.string,
  }),
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
};

DateRangeInput.defaultProps = {
  locales: {
    overlappingDatesMessage: DEFAULT_OVERLAPPING_DATES_MESSAGE,
    invalidDateMessage: DEFAULT_INVALID_DATE_MESSAGE,
  },
  label: '',
  value: [null, null],
  onChange () {
  },
};

export default (DateRangeInput);
