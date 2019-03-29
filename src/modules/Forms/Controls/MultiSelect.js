import React from 'react';

import PropTypes from 'prop-types';

import {
  Button,
  FormGroup,
  Intent,
  MenuItem,
} from '@blueprintjs/core';
import { MultiSelect as BPMultiSelect } from '@blueprintjs/select';

const DEFAULT_LOCALES = { noResults: 'No results.' };

export class MultiSelect extends React.Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.string),
    locales: PropTypes.shape({ noResults: PropTypes.string }),
    label: PropTypes.string,
    onChange: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    locales: DEFAULT_LOCALES,
    label: '',
    value: [],
    onChange () {},
  };

  state = {
    items: [],
    query: '',
  };

  componentDidMount () {
    this.updateItems();
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
    const { label, locales, value, ...props } = this.props;

    const displayClearButton = value.length > 0;

    const filteredItems = query === ''
      ? items
      : items.filter(item => item.toLowerCase().includes(query.toLowerCase()));

    return (
      <FormGroup
        label={label}
      >
        <BPMultiSelect
          resetOnSelect
          items={filteredItems}
          selectedItems={value}
          noResults={<MenuItem disabled text={locales.noResults || DEFAULT_LOCALES.noResults} />}
          onItemSelect={handleChange}
          onQueryChange={handleQueryChange}
          tagRenderer={item => item}
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
      </FormGroup>
    );
  }
}

export default MultiSelect;
