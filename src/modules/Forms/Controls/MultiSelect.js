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
import NoValues from './NoValues';
import formatValues from './formatValues';

// With more than 250 items we don't display result but we propose a search
const MAX_DISPLAY_ITEMS = 250;

export class MultiSelect extends React.Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.string),
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
      'terralego.forms.controls.noValues': 'No choice available',
    }),
    loading: false,
    minCharacters: 0,
    highlightSearch: true,
  };

  state = {
    values: [],
    value: [],
  }

  static getDerivedStateFromProps ({ values, value }) {
    const formatedValues = formatValues(values);

    const formatedValue = value.map(val => ({
      label: formatedValues.find(({ value: availableVal }) => val === availableVal).label,
      value: val,
    }));

    return {
      values: formatedValues,
      value: formatedValue,
    };
  }

  handleChange = item => {
    const { value, onChange } = this.props;
    const newValue = value.includes(item.value)
      ? [...value.filter(val => val !== item.value)]
      : [...value, item.value];
    onChange(newValue);
  };

  handleTagRemove = (_, index) => {
    const { value, onChange } = this.props;
    const newValue = value.filter((__, idx) => idx !== index);
    onChange(newValue);
  }

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
      value: origValue,
      isSubmissionPrevented,
      className,
      translate,
      loading,
      minCharacters,
      highlightSearch,
      ...props
    } = this.props;

    const { values, value } = this.state;
    const displayClearButton = value.length > 0;

    return (
      <div
        className="control-container"
        onKeyPress={isSubmissionPrevented ? preventEnterKeyPress : null}
        role="presentation"
      >
        <p className="control-label">{label}</p>
        {loading && <Spinner size={20} />}
        {!loading && !values.length && <NoValues placeholder={translate('terralego.forms.controls.noValues')} />}
        {!loading && (
          <BPMultiSelect
            className={classnames('tf-multiselect', className)}
            resetOnSelect
            fill
            items={values}
            selectedItems={value}
            onItemSelect={handleChange}
            tagRenderer={item => item.label}
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
                : items.filter(item => regExp.test(item.label));
            }}
            itemRenderer={({ label: itemLabel, value: itemValue }, {
              query, handleClick, modifiers: { matchesPredicate, ...modifiers },
            }) => {
              if (!matchesPredicate) {
                return null;
              }
              const regExp = new RegExp(`(${query})`, 'i');
              return (
                <MenuItem
                  active={modifiers.active}
                  icon={origValue.includes(itemValue) ? 'tick' : 'blank'}
                  key={`${itemValue}${itemLabel}`}
                  onClick={handleClick}
                  text={query && highlightSearch
                    ? itemLabel.split(regExp).map(
                      // eslint-disable-next-line react/no-array-index-key
                      (elem, i) => (i % 2 ? <strong key={`${itemLabel}-${i}`}>{elem}</strong> : elem),
                    ) : itemLabel}
                  shouldDismissPopover={false}
                />
              );
            }}
            itemListRenderer={listProps => {
              const items = listProps.filteredItems;
              let message = null;
              // If we have no query or a query too short and too many results
              if ((!listProps.query || listProps.query.length < minCharacters)
                && items.length > MAX_DISPLAY_ITEMS) {
                message = translate('terralego.forms.controls.multiselect.select_placeholder', { count: minCharacters });
              } else if (items.length > MAX_DISPLAY_ITEMS) {
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
