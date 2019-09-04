import React from 'react';
import moize from 'moize';

import { TYPE_MANY } from './Filters';

const getValuesWithEmptyItem = moize((values, emptySelectItem) => [{
  value: '',
  label: emptySelectItem,
}, ...values]);

export class Control extends React.Component {
  static getDerivedStateFromProps (props) {
    const {
      values,
      type,
      translate,
    } = props;
    if (!values) return null;

    const withEmptyValue = values && type !== TYPE_MANY;

    return {
      values: withEmptyValue
        ? getValuesWithEmptyItem(values, translate('terralego.forms.controls.generic.empty_item'))
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
