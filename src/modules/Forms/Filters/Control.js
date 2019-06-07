import React from 'react';
import moize from 'moize';

import { TYPE_MANY } from './Filters';

const getValuesWithEmptyItem = moize((values, emptySelectItem) => [{
  value: '',
  label: emptySelectItem,
}, ...values]);

export class Control extends React.Component {
  static getDerivedStateFromProps ({ values, locales: { emptySelectItem }, type }) {
    if (!values) return null;

    const withEmptyValue = values && type !== TYPE_MANY;

    return {
      values: withEmptyValue
        ? getValuesWithEmptyItem(values, emptySelectItem)
        : values,
    };
  }

  state = {
    values: [],
  };

  render () {
    const { component: Component, ...props } = this.props;
    const { values } = this.state;

    return (
      <Component
        {...props}
        values={values}
      />
    );
  }
}

export default Control;
