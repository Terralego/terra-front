import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { MenuItem, Button, Position } from '@blueprintjs/core';
import { Select as BPSelect } from '@blueprintjs/select';
import uuid from 'uuid/v4';

import { preventEnterKeyPress } from '../../../../utils/event';
import formatValues from '../formatValues';

export class Select extends React.Component {
  static propTypes = {
    locales: PropTypes.shape({ noResults: PropTypes.string }),
    label: PropTypes.string,
    onChange: PropTypes.func,
    values: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
        }),
      ]),
    ).isRequired,
    placeholder: PropTypes.string,
    isSubmissionPrevented: PropTypes.bool,
  };

  static defaultProps = {
    locales: { noResults: 'No results.' },
    label: '',
    placeholder: 'Filter…',
    isSubmissionPrevented: true,
    onChange () {},
  };

  static getDerivedStateFromProps ({ values }) {
    if (!values) return null;

    return {
      values: formatValues(values),
    };
  }

  state = {
    values: [],
    query: '',
  };

  uuid = `select-${uuid()}`;

  handleChange = ({ value }) => {
    const { onChange } = this.props;
    onChange(value);
  };

  handleQueryChange = query => {
    this.setState({ query });
  };

  render () {
    const {
      label,
      locales: { noResults, emptySelectItem },
      placeholder,
      isSubmissionPrevented,
      value,
      className,
      inline,
      fullWidth,
      ...props
    } = this.props;

    const { values, query } = this.state;
    const { handleChange } = this;
    const filteredItems = query === ''
      ? values
      : values.filter(({ label: itemLabel }) =>
        itemLabel.toLowerCase().includes(query.toLowerCase()));

    return (
      <div
        className={classnames(
          'control-container',
          'control-container--select',
          { 'control-container--full-width': fullWidth },
        )}
        onKeyPress={isSubmissionPrevented ? preventEnterKeyPress : null}
        role="presentation"
      >
        <label
          htmlFor={this.uuid}
          className={classnames(
            'control-label',
            { 'control-label--inline': inline },
          )}
        >
          {label}
        </label>
        <BPSelect
          className={classnames('tf-select', className)}
          popoverProps={{ usePortal: false, position: Position.BOTTOM_LEFT, minimal: true }}
          items={filteredItems}
          filterable={values.length > 9}
          inputProps={{ placeholder }}
          onQueryChange={this.handleQueryChange}
          itemRenderer={({
            label: itemLabel, value: itemValue,
          }, {
            handleClick, modifiers: { matchesPredicate, ...modifiers },
          }) => (
            <div
              key={`${itemValue}${itemLabel}`}
              className={classnames({
                'control-container__item': true,
                'control-container__item--empty': itemValue === '',
              })}
            >
              <MenuItem
                {...modifiers}
                onClick={handleClick}
                text={itemLabel}
              />
            </div>
          )}
          noResults={<MenuItem disabled text={noResults} />}
          onItemSelect={handleChange}
          {...props}
        >
          <Button id={this.uuid} text={value || emptySelectItem} rightIcon="double-caret-vertical" />
        </BPSelect>
      </div>
    );
  }
}

export default Select;
