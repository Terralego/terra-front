import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select as BPSelect } from '@blueprintjs/select';

import { preventEnterKeyPress } from '../../../utils/event';

export class Select extends React.Component {
  static propTypes = {
    locales: PropTypes.shape({ noResults: PropTypes.string }),
    label: PropTypes.string,
    onChange: PropTypes.func,
    values: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string ||
        PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
      ]),
    ),
    placeholder: PropTypes.string,
    isSubmissionPrevented: PropTypes.bool,
  };

  static defaultProps = {
    locales: { noResults: 'No results.' },
    label: '',
    values: [],
    placeholder: 'Filter…',
    isSubmissionPrevented: true,
    onChange () {},
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

    if (values !== prevValues) {
      this.updateItems();
    }
  }

  handleChange = ({ value }) => {
    const { onChange } = this.props;
    onChange(value);
  };

  handleQueryChange = query => {
    this.setState({ query });
  };

  updateItems () {
    const { values, locales: { emptySelectItem = '' } } = this.props;
    this.setState({
      items: [{ label: emptySelectItem, value: null }, ...values].map(item => ({
        label: item.label !== undefined ? item.label : item,
        value: item.value !== undefined ? item.value : item,
      })),
    });
  }

  render () {
    const {
      label,
      values,
      locales: { noResults, emptySelectItem },
      placeholder,
      isSubmissionPrevented,
      value,
      className,
      ...props
    } = this.props;

    const { items, query } = this.state;
    const { handleChange } = this;
    const filteredItems = query === ''
      ? items
      : items.filter(({ label: itemLabel = '' }) => itemLabel.toLowerCase().includes(query.toLowerCase()));
    return (
      <div
        className="control-container"
        onKeyPress={isSubmissionPrevented ? preventEnterKeyPress : null}
        role="presentation"
      >
        <p className="control-label">{label}</p>
        <BPSelect
          className={classnames('tf-select', className)}
          popoverProps={{ usePortal: false }}
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
          <Button text={value || emptySelectItem} rightIcon="double-caret-vertical" />
        </BPSelect>
      </div>
    );
  }
}

export default Select;
