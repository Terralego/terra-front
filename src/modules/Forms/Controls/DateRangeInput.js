import React from 'react';

import PropTypes from 'prop-types';

import { FormGroup } from '@blueprintjs/core';
import { DateRangeInput as BPDateRangeInput } from '@blueprintjs/datetime';

// Date Format
const formatDate = date => date.toLocaleDateString();
const parseDate = str => new Date(str);

// Date Error Message
const defaultOverlappingDatesMessage = 'Overlapping date';
const defaultInvalidDateMessage = 'Overlapping date';

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
      overlappingDatesMessage={overlappingDatesMessage || defaultOverlappingDatesMessage}
      invalidDateMessage={invalidDateMessage || defaultInvalidDateMessage}
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
    overlappingDatesMessage: 'Overlapping date',
    invalidDateMessage: 'Invalid date.',
  },
  label: '',
  value: [null, null],
  onChange () {
  },
};

export default (DateRangeInput);
