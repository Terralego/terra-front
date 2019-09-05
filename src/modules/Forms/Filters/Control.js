import React from 'react';
import moize from 'moize';
import PropTypes from 'prop-types';
import translateMock from '../../../utils/translate';

import { TYPE_MANY } from './Filters';

const getValuesWithEmptyItem = moize((values, emptySelectItem) => [{
  value: '',
  label: emptySelectItem,
}, ...values]);

const defaultTranslate = translateMock({
  'terralego.forms.controls.generic.empty_item': 'Nothing',
});

export class Control extends React.Component {
  static propTypes = {
    translate: PropTypes.func,
  };

  static defaultProps = {
    translate: defaultTranslate,
  };

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
    const { component: Component, translate, ...props } = this.props;
    const { values } = this.state;

    return (
      <Component
        translate={translate === defaultTranslate ? undefined : translate}
        {...props}
        values={values}
      />
    );
  }
}

export default Control;
