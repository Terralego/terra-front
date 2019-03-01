import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select as BPSelect } from '@blueprintjs/select';

import './index.scss';

export class Select extends React.Component {
  static propTypes = {
    locales: PropTypes.shape({ noResults: PropTypes.string }),
    label: PropTypes.string,
    onChange: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    locales: { noResults: 'No results.' },
    label: '',
    values: [],
    onChange () {},
  }

  state = {
    items: [],
  }

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
  }

  updateItems () {
    const { values, locales: { emptySelectItem } } = this.props;
    this.setState({
      items: ['', ...values].map(v => ({
        // TODO changer RIEN par une locale venant de Filters
        label: (v === '' ? emptySelectItem : v),
        value: v,
      })),
    });
  }

  render () {
    const {
      label,
      values,
      locales: { noResults },
      value,
    } = this.props;
    const { items } = this.state;
    const { handleChange } = this;

    return (
      <div className="control-container">
        <p className="control-label">{label}</p>
        <BPSelect
          popoverProps={{ usePortal: false }}
          items={items}
          filterable={values.length > 9}
          itemRenderer={({
            label: itemLabel, value: itemValue,
          }, {
            handleClick, modifiers: { matchesPredicate, ...modifiers },
          }) => (
            <div className={classnames({
              'control-container__item': true,
              'control-container__item--empty': itemValue === '',
            })}
            >
              <MenuItem
                {...modifiers}
                onClick={handleClick}
                key={itemValue}
                text={itemLabel}
              />
            </div>
          )}
          noResults={<MenuItem disabled text={noResults} />}
          onItemSelect={handleChange}
        >
          <Button text={value} rightIcon="double-caret-vertical" />
        </BPSelect>
      </div>
    );
  }
}

export default Select;
