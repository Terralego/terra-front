import React from 'react';
import classnames from 'classnames';

import PropTypes from 'prop-types';

import { DateRangeInput as BPDateRangeInput } from '@blueprintjs/datetime';

import localeUtils from '../../../utils/localeUtils';
import translateMock from '../../../utils/translate';

// Date Format
const formatDate = date => date.toLocaleDateString();
const parseDate = str => new Date(str);

export const DateRangeInput = ({
  className,
  label,
  value,
  onChange,
  translate,
  locale = global.navigator.language,
  shortcuts = false,
  ...props
}) => (
  <div
    className="control-container"
  >
    <p className="control-label">{label}</p>
    <BPDateRangeInput
      className={classnames('tf-control-date-range', className)}
      formatDate={formatDate}
      onChange={onChange}
      parseDate={parseDate}
      value={value}
      overlappingDatesMessage={translate('terralego.forms.controls.daterangeinput.overlapping_dates')}
      invalidDateMessage={translate('terralego.forms.controls.daterangeinput.invalid_date')}
      popoverProps={{ usePortal: false }}
      localeUtils={localeUtils}
      locale={locale.substr(0, 2)}
      shortcuts={shortcuts}
      startInputProps={{
        placeholder: translate('terralego.forms.controls.daterangeinput.start_placeholder'),
        className: 'tf-control-date-range__start-input',
      }}
      endInputProps={{
        placeholder: translate('terralego.forms.controls.daterangeinput.end_placeholder'),
        className: 'tf-control-date-range__en d-input',
      }}
      {...props}
    />
  </div>
);

DateRangeInput.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  translate: PropTypes.func,
};

DateRangeInput.defaultProps = {
  label: '',
  value: [null, null],
  onChange () {},
  translate: translateMock({
    'terralego.forms.controls.daterangeinput.overlapping_dates': 'Overlapping date',
    'terralego.forms.controls.daterangeinput.invalid_date': 'Invalid date',
    'terralego.forms.controls.daterangeinput.start_placeholder': 'Start date',
    'terralego.forms.controls.daterangeinput.end_placeholder': 'End date',
  }),
};

export default DateRangeInput;
