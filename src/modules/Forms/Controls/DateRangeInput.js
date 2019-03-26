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
    values: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
    dateInput: PropTypes.shape({
      rangeStart: PropTypes.shape({
        placeholder: PropTypes.string,
        className: PropTypes.string,
      }),
      rangeEnd: PropTypes.shape({
        placeholder: PropTypes.string,
        className: PropTypes.string,
      }),
    }),
  };

  static defaultProps = {
    locales: {
      overlappingDatesMessage: 'Overlapping date',
      invalidDateMessage: 'Invalid date.',
    },
    label: '',
    values: [null, null],
    className: 'tf-date-range',
    dateInput: {
      rangeStart: {
        placeholder: 'From MM/DD/YYYY',
        className: 'tf-range-start',
      },
      rangeEnd: {
        placeholder: 'To MM/DD/YYYY',
        className: 'tf-range-end',
      },
    },
    onChange () {
    },
  };

  state = {
    rangeDate: [],
  };

  componentDidMount () {
    this.updateItems();
  }

  updateItems () {
    const { values } = this.props;
    this.setState({
      rangeDate: values,
    }, () => console.log(this.state));
  }

  formatDate = date => date.toLocaleDateString();

  parseDate = str => new Date(str);

  handleRangeDateChange = rangeDate => {
    const { onChange } = this.props;
    onChange({ rangeDate });
  };

  render () {
    const { rangeDate } = this.state;
    const {
      className,
      label,
      locales: { overlappingDatesMessage, invalidDateMessage },
      dateInput: { rangeStart, rangeEnd },
    } = this.props;
    const { formatDate, parseDate, handleRangeDateChange } = this;
    return (
      <FormGroup
        label={label}
      >
        <BPDateRangeInput
          className={className}
          allowSingleDayRange
          overlappingDatesMessage={overlappingDatesMessage}
          invalidDateMessage={invalidDateMessage}
          contiguousCalendarMonths={false}
          formatDate={formatDate}
          onChange={handleRangeDateChange}
          parseDate={parseDate}
          value={rangeDate}
          startInputProps={{
            placeholder: rangeStart.placeholder,
            className: rangeStart.className,
          }}
          endInputProps={{
            placeholder: rangeEnd.placeholder,
            className: rangeEnd.className,
          }}
        />
      </FormGroup>
    );
  }
}

export default (DateRangeInput);
