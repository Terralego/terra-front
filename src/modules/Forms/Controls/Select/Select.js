import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { MenuItem, Button, Spinner } from '@blueprintjs/core';
import { Select as BPSelect } from '@blueprintjs/select';
import uuid from 'uuid/v4';

import { preventEnterKeyPress } from '../../../../utils/event';
import translateMock from '../../../../utils/translate';
import formatValues from '../formatValues';

export class Select extends React.Component {
  static propTypes = {
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
    isSubmissionPrevented: PropTypes.bool,
    translate: PropTypes.func,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    isSubmissionPrevented: true,
    onChange () {},
    translate: translateMock({
      'terralego.forms.controls.select.empty_item': 'All',
      'terralego.forms.controls.select.no_results': 'No results.',
    }),
    loading: false,
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
      placeholder,
      isSubmissionPrevented,
      value,
      className,
      inline,
      fullWidth,
      translate,
      loading,
      ...props
    } = this.props;

    const { values, query } = this.state;
    const { handleChange } = this;
    const filteredItems = query === ''
      ? values
      : values.filter(({ label: itemLabel }) =>
        itemLabel.toLowerCase().includes(query.toLowerCase()));
    const displayedValue = typeof value === 'object' ? value.label : value;
    const rawValue = typeof value === 'object' ? value.value : value;

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
        {!!loading && <Spinner size={20} />}
        {!loading && (
          <BPSelect
            className={classnames('tf-select', className)}
            popoverProps={{ usePortal: false, boundary: 'viewport', minimal: true }}
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
                  active={rawValue === itemValue}
                  onClick={handleClick}
                  text={itemLabel}
                />
              </div>
            )}
            noResults={(
              <MenuItem
                disabled
                text={translate('terralego.forms.controls.select.no_results')}
              />
            )}
            onItemSelect={handleChange}
            {...props}
          >
            <Button
              id={this.uuid}
              text={displayedValue || translate('terralego.forms.controls.select.empty_item')}
              rightIcon="double-caret-vertical"
            />
          </BPSelect>
        )}
      </div>
    );
  }
}

export default Select;
