import React from 'react';

import PropTypes from 'prop-types';

import {
  Button,
  FormGroup,
  Intent,
  MenuItem,
} from '@blueprintjs/core';
import { MultiSelect as BPMultiSelect } from '@blueprintjs/select';

export class MultiSelect extends React.Component {
  static propTypes = {
    locales: PropTypes.shape({ noResults: PropTypes.string }),
    label: PropTypes.string,
    onChange: PropTypes.func,
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
    onChange () {
    },
  };

  state = {
    items: [],
    selectedItems: [],
    query: '',
  };

  componentDidMount () {
    this.updateItems();
  }

  getSelectedIndex (item) {
    const { selectedItems } = this.state;
    return selectedItems.indexOf(item);
  }

  handleChange = item => {
    const { onChange } = this.props;
    if (!this.isItemSelected(item)) {
      this.selectItem(item);
      onChange(item);
    } else {
      this.deselectItem(this.getSelectedIndex(item));
      onChange(item);
    }
  };

  handleQueryChange = query => {
    this.setState({ query });
  };

  handleTagRemove = (tag, index) => {
    this.deselectItem(index);
  };

  handleClear = () => this.setState({ selectedItems: [] });

  selectItem (item) {
    const { selectedItems } = this.state;
    this.setState({ selectedItems: [...selectedItems, item] });
  }

  updateItems () {
    const { values } = this.props;
    this.setState({
      items: [...values].map((v, index) => ({
        id: index,
        label: v,
        value: v,
      })),
    }, () => this.state);
  }

  isItemSelected (item) {
    return this.getSelectedIndex(item) !== -1;
  }

  deselectItem (index) {
    const { selectedItems } = this.state;
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    this.setState({ selectedItems: newItems });
  }

  renderTag = item => item.label;

  render () {
    const {
      handleChange,
      handleTagRemove,
      handleQueryChange,
      renderTag,
    } = this;
    const { items, query, selectedItems } = this.state;
    const { placeholder, className, label, locales } = this.props;

    const clearButton = selectedItems.length > 0 ? <Button icon="cross" minimal onClick={this.handleClear} /> : null;

    const filteredItems = query === ''
      ? items
      : items.filter(({ label: itemLabel = '' }) => itemLabel.toLowerCase().includes(query.toLowerCase()));

    return (
      <FormGroup
        label={label}
      >
        <BPMultiSelect
          resetOnSelect
          items={filteredItems}
          selectedItems={selectedItems}
          className={className}
          noResults={<MenuItem disabled text={locales.noResults} />}
          onItemSelect={handleChange}
          onQueryChange={handleQueryChange}
          tagRenderer={renderTag}
          placeholder={placeholder}
          tagInputProps={{
            tagProps: { intent: Intent.NONE, interactive: true },
            onRemove: handleTagRemove,
            rightElement: clearButton,
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
                icon={this.isItemSelected(item) ? 'tick' : 'blank'}
                key={item.id}
                onClick={handleClick}
                text={item.label}
                shouldDismissPopover={false}
              />
            );
          }}
        />
      </FormGroup>
    );
  }
}

export default MultiSelect;
