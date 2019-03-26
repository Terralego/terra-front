import React from 'react';

import PropTypes from 'prop-types';

import { FormGroup } from '@blueprintjs/core';
import { DateRangeInput as BPDateRangeInput } from '@blueprintjs/datetime';

export class DateRangeInput extends React.Component {
  static propTypes = {
    locales: PropTypes.shape({
      overlappingDatesMessage: PropTypes.string,
      invalidDateMessage: PropTypes.string,
    }),
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  };

  static defaultProps = {
    locales: {
      overlappingDatesMessage: 'Overlapping date',
      invalidDateMessage: 'Invalid date.',
    },
    label: '',
    value: [null, null],
    onChange () {
    },
  };

  formatDate = date => date.toLocaleDateString();

  parseDate = str => new Date(str);

  render () {
    const {
      className,
      label,
      value,
      onChange,
      locales: { overlappingDatesMessage, invalidDateMessage },
      ...props
    } = this.props;
    const { formatDate, parseDate } = this;
    const defaultOverlappingDatesMessage = 'Overlapping date';
    const defaultInvalidDateMessage = 'Overlapping date';
    return (
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
  }
}

export default (DateRangeInput);
