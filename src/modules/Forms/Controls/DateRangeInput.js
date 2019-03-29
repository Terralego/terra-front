import React from 'react';
import classnames from 'classnames';

import PropTypes from 'prop-types';

import { FormGroup } from '@blueprintjs/core';
import { DateRangeInput as BPDateRangeInput } from '@blueprintjs/datetime';

import localeUtils from '../../../utils/localeUtils';

// Date Format
const formatDate = date => date.toLocaleDateString();
const parseDate = str => new Date(str);

// Date Error Message
const DEFAULT_LOCALES = {
  overlappingDatesMessage: 'Overlapping date.',
  invalidDateMessage: 'Invalid date.',
  startInputProps: 'Start date',
  endInputProps: 'End date',
};

export const DateRangeInput = ({
  className,
  label,
  value,
  onChange,
  locales,
  locales: {
    overlappingDatesMessage = DEFAULT_LOCALES.overlappingDatesMessage,
    invalidDateMessage = DEFAULT_LOCALES.invalidDateMessage,
    startInputProps = DEFAULT_LOCALES.startInputProps,
    endInputProps = DEFAULT_LOCALES.endInputProps,
  },
  locale = global.navigator.language,
  shortcuts = false,
  ...props
}) => (
  <FormGroup
    label={label}
  >
    <BPDateRangeInput
      className={classnames('tf-control-date-range', className)}
      formatDate={formatDate}
      onChange={onChange}
      parseDate={parseDate}
      value={value}
      overlappingDatesMessage={overlappingDatesMessage}
      invalidDateMessage={invalidDateMessage}
      popoverProps={{ usePortal: false }}
      localeUtils={{ ...localeUtils, ...locales }}
      locale={locale.substr(0, 2)}
      shortcuts={shortcuts}
      startInputProps={{
        placeholder: startInputProps,
        className: 'tf-control-date-range__start-input',
      }}
      endInputProps={{
        placeholder: endInputProps,
        className: 'tf-control-date-range__en d-input',
      }}
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
  onChange () {},
};

export default (DateRangeInput);
