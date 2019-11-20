import React from 'react';

import PropTypes from 'prop-types';

import classnames from 'classnames';
import {
  Button,
  Intent,
  MenuItem,
  Spinner,
} from '@blueprintjs/core';
import { MultiSelect as BPMultiSelect } from '@blueprintjs/select';

import { preventEnterKeyPress } from '../../../utils/event';
import translateMock from '../../../utils/translate';

export class MultiSelect extends React.Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.string,
    onChange: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    isSubmissionPrevented: PropTypes.bool,
    translate: PropTypes.func,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    value: [],
    isSubmissionPrevented: true,
    onChange () {},
    translate: translateMock({
      'terralego.forms.controls.multiselect.no_results': 'No results.',
      'terralego.forms.controls.multiselect.select_placeholder': 'Enter a query first',
      'terralego.forms.controls.multiselect.input_placeholder': 'Filter...',
    }),
    loading: false,
  };

  state = {
    items: [],
    query: '',
  };

  componentDidMount () {
    this.updateItems();
  }

  componentDidUpdate ({ values: prevValues }) {
    const { values } = this.props;
    if (prevValues !== values) {
      this.updateItems();
    }
  }

  handleChange = item => {
    const { value, onChange } = this.props;
    const newValue = value.includes(item)
      ? [...value.filter(val => val !== item)]
      : [...value, item];
    onChange(newValue);
  };

  handleQueryChange = query => {
    this.setState({ query });
  };

  handleTagRemove = tag => this.handleChange(tag);

  handleClear = () => {
    const { onChange } = this.props;
    onChange([]);
  };

  updateItems () {
    const { values } = this.props;
    this.setState({
      items: [...values],
    });
  }

  render () {
    const {
      handleChange,
      handleTagRemove,
      handleQueryChange,
    } = this;
    const { items, query } = this.state;
    const {
      label,
      value,
      values,
      isSubmissionPrevented,
      className,
      translate,
      loading,
      ...props
    } = this.props;

    const displayClearButton = value.length > 0;

    const filteredItems = query === ''
      ? items
      : items.filter(item => item.toLowerCase().includes(query.toLowerCase()));

    return (
      <div
        className="control-container"
        onKeyPress={isSubmissionPrevented ? preventEnterKeyPress : null}
        role="presentation"
      >
        <p className="control-label">{label}</p>
        {!!loading && <Spinner size={20} /> }
        {!loading && (
          <BPMultiSelect
            className={classnames('tf-multiselect', className)}
            resetOnSelect
            items={filteredItems}
            selectedItems={value}
            noResults={<MenuItem disabled text={translate('terralego.forms.controls.multiselect.no_results')} />}
            onItemSelect={handleChange}
            onQueryChange={handleQueryChange}
            tagRenderer={item => item}
            popoverProps={{ usePortal: false }}
            initialContent={(values && values.length > 250)
              ? <MenuItem disabled text={translate('terralego.forms.controls.multiselect.select_placeholder')} />
              : undefined
            }
            placeholder={translate('terralego.forms.controls.multiselect.input_placeholder')}
            tagInputProps={{
              tagProps: { intent: Intent.NONE, interactive: true },
              onRemove: handleTagRemove,
              rightElement: displayClearButton && (
              <Button icon="cross" minimal onClick={this.handleClear} />
              ),
            }}
            itemRenderer={(item, {
              handleClick, modifiers: { matchesPredicate, ...modifiers },
            }) => {
              if (!matchesPredicate) {
                return null;
              }
              return (
                <MenuItem
                  active={modifiers.active}
                  icon={value.includes(item) ? 'tick' : 'blank'}
                  key={item}
                  onClick={handleClick}
                  text={item}
                  shouldDismissPopover={false}
                />
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
