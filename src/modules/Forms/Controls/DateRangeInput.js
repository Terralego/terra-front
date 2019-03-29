import React from 'react';

import PropTypes from 'prop-types';

import { FormGroup } from '@blueprintjs/core';
import { DateRangeInput as BPDateRangeInput } from '@blueprintjs/datetime';

// Date Format
const formatDate = date => date.toLocaleDateString();
const parseDate = str => new Date(str);

// Date Error Message
const DEFAULT_LOCALES = {
  overlappingDatesMessage: 'Overlapping date.',
  invalidDateMessage: 'Invalid date.',
};

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
      overlappingDatesMessage={overlappingDatesMessage || DEFAULT_LOCALES.overlappingDatesMessage}
      invalidDateMessage={invalidDateMessage || DEFAULT_LOCALES.invalidDateMessage}
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
    overlappingDatesMessage: DEFAULT_LOCALES.overlappingDatesMessage,
    invalidDateMessage: DEFAULT_LOCALES.invalidDateMessage,
  },
  label: '',
  value: [null, null],
  onChange () {
  },
};

export default (DateRangeInput);
