import React from 'react';

import PropTypes from 'prop-types';

import classnames from 'classnames';
import {
  Button,
  Intent,
  Menu,
  MenuItem,
  Spinner,
} from '@blueprintjs/core';
import { MultiSelect as BPMultiSelect } from '@blueprintjs/select';

import { preventEnterKeyPress } from '../../../utils/event';
import translateMock from '../../../utils/translate';

/**
 * Highlight with <strong> element
 *
 * @param {string} item - Item to highlight
 * @param {string} query - Query to use as highlight
 * @param {RegExp} regExp - Regular expression to use as splitter (must use capturing parenthesis)
 * @return {Array} Can be used as React.el
 */
const highlightItem = (item, query, regExp) =>
  // Complex highlighting because we must take case into account
  item.split(regExp).reduce((accu, elem) =>
    // Use a reducer for a JSX join
    [...accu, accu.length % 2 ? (
      // Then get the case-friendly query part of item
      <strong key={accu.length}>{elem}</strong>
    ) : elem], []);

export class MultiSelect extends React.Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.string,
    onChange: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    isSubmissionPrevented: PropTypes.bool,
    translate: PropTypes.func,
    loading: PropTypes.bool,
    minCharacters: PropTypes.number,
    highlightSearch: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    value: [],
    isSubmissionPrevented: true,
    onChange () {},
    translate: translateMock({
      'terralego.forms.controls.multiselect.no_results': 'No results.',
      'terralego.forms.controls.multiselect.select_placeholder': 'Enter a query first',
      'terralego.forms.controls.multiselect.select_placeholder_plural': 'Enter at least {{count}} characters',
      'terralego.forms.controls.multiselect.input_placeholder': 'Search...',
      'terralego.forms.controls.multiselect.too_many': 'Too many results, please refine your query...',
    }),
    loading: false,
    minCharacters: 0,
    highlightSearch: true,
  };

  handleChange = item => {
    const { value, onChange } = this.props;
    const newValue = value.includes(item)
      ? [...value.filter(val => val !== item)]
      : [...value, item];
    onChange(newValue);
  };

  handleTagRemove = tag => this.handleChange(tag);

  handleClear = () => {
    const { onChange } = this.props;
    onChange([]);
  };

  render () {
    const {
      handleChange,
      handleTagRemove,
    } = this;
    const {
      label,
      value,
      values,
      isSubmissionPrevented,
      className,
      translate,
      loading,
      minCharacters,
      highlightSearch,
      ...props
    } = this.props;

    const displayClearButton = value.length > 0;

    return (
      <div
        className="control-container"
        onKeyPress={isSubmissionPrevented ? preventEnterKeyPress : null}
        role="presentation"
      >
        <p className="control-label">{label}</p>
        {!!loading && <Spinner size={20} />}
        {!loading && (
          <BPMultiSelect
            className={classnames('tf-multiselect', className)}
            resetOnSelect
            fill
            items={values}
            selectedItems={value}
            onItemSelect={handleChange}
            tagRenderer={item => item}
            popoverProps={{ usePortal: false }}
            placeholder={translate('terralego.forms.controls.multiselect.input_placeholder')}
            tagInputProps={{
              tagProps: { intent: Intent.NONE, interactive: true },
              onRemove: handleTagRemove,
              rightElement: displayClearButton && (
                <Button icon="cross" minimal onClick={this.handleClear} />
              ),
            }}
            itemListPredicate={(query, items) => {
              const regExp = new RegExp(query, 'i');
              return query.length < minCharacters
                ? items
                : items.filter(item => regExp.test(item));
            }}
            itemRenderer={(item, {
              query, handleClick, modifiers: { matchesPredicate, ...modifiers },
            }) => {
              if (!matchesPredicate) {
                return null;
              }
              const regExp = new RegExp(`(${query})`, 'i');
              return (
                <MenuItem
                  active={modifiers.active}
                  icon={value.includes(item) ? 'tick' : 'blank'}
                  key={item}
                  onClick={handleClick}
                  text={query && highlightSearch
                    ? <span>{highlightItem(item, query, regExp)}</span>
                    : item}
                  shouldDismissPopover={false}
                />
              );
            }}
            itemListRenderer={listProps => {
              const items = listProps.filteredItems;
              let message = null;

              // If we have no query or a query too short and too many results
              if ((!listProps.query || listProps.query.length < minCharacters)
                && items.length > 250) {
                message = translate('terralego.forms.controls.multiselect.select_placeholder', { count: minCharacters });
              } else if (items.length > 250) {
                // If we have a query but too many results
                message = translate('terralego.forms.controls.multiselect.too_many');
              } else if (items.length === 0) {
                // If we have no results
                message = translate('terralego.forms.controls.multiselect.no_results');
              }
              return (
                <Menu ulRef={listProps.itemsParentRef}>
                  {message !== null
                    ? (
                      <MenuItem
                        disabled
                        text={message}
                      />
                    )
                    : items.map(listProps.renderItem)
                  }
                </Menu>
              );
            }}
            {...props}
          />
        )}
      </div>
    );
  }
}

export default MultiSelect;
