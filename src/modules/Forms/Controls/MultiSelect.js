import React from 'react';

import PropTypes from 'prop-types';

import { Button, FormGroup, Intent, MenuItem } from '@blueprintjs/core';
import { MultiSelect as BPMultiSelect } from '@blueprintjs/select';

export class MultiSelect extends React.Component {
  static propTypes = {
    locales: PropTypes.shape({ noResults: PropTypes.string }),
    label: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
    placeholder: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    locales: { noResults: 'No results.' },
    label: '',
    values: [],
    placeholder: 'Filter…',
    className: 'tf-multiselect',
  };

  state = {
    items: [],
  };

  getSelectedIndex (item) {
    const { items } = this.state;
    return items.indexOf(item);
  }

  handleItemSelect = item => {
    if (!this.isItemSelected(item)) {
      this.selectItem(item);
    } else {
      this.deselectItem(this.getSelectedIndex(item));
    }
  };

  handleTagRemove = (tag, index) => {
    this.deselectItem(index);
  };

  handleClear = () => this.setState({ items: [] });

  filterList = (query, items) => items.filter(item =>
    item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0);

  selectItem (item) {
    const { items } = this.state;
    this.setState({ items: [...items, item] });
  }

  isItemSelected (item) {
    return this.getSelectedIndex(item) !== -1;
  }

  deselectItem (index) {
    const { items } = this.state;
    const newItems = [...items];
    newItems.splice(index, 1);
    this.setState({ items: newItems });
  }


  renderInputValue = item => item.label;

  renderTag = item => item.label;

  renderItem = (item, { modifiers, handleClick }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        icon={this.isItemSelected(item) ? 'tick' : 'blank'}
        key={item.id}
        onClick={handleClick}
        text={`${item.label}`}
        shouldDismissPopover={false}
      />
    );
  };

  render () {
    const {
      renderInputValue,
      renderItem,
      handleItemSelect,
      renderTag,
      handleTagRemove,
      filterList,
    } = this;
    const { items } = this.state;
    const { values, placeholder, className, label } = this.props;

    const clearButton = items.length > 0 ? <Button icon="cross" minimal onClick={this.handleClear} /> : null;

    return (
      <FormGroup
        label={label}
      >
        <BPMultiSelect
          items={values}
          inputValueRenderer={renderInputValue}
          itemRenderer={renderItem}
          itemListPredicate={filterList}
          noResults={<MenuItem disabled text="Aucun résultats" />}
          onItemSelect={handleItemSelect}
          tagRenderer={renderTag}
          placeholder={placeholder}
          tagInputProps={{
            tagProps: { intent: Intent.NONE, interactive: true },
            onRemove: handleTagRemove,
            rightElement: clearButton,
          }}
          selectedItems={items}
          className={className}
        />
      </FormGroup>
    );
  }
}

export default MultiSelect;
