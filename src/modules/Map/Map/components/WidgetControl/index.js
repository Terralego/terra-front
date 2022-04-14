import React from 'react';
import { Icon } from '@blueprintjs/core';

import Tooltip from '../../../../../components/Tooltip';
import AbstractMapControl from '../../../helpers/AbstractMapControl';
import { DEFAULT_OPTIONS } from '../../../../State/Hash/withHashState';

class WidgetControl extends AbstractMapControl {
  options = DEFAULT_OPTIONS

  render () {
    const { toggleWidget, translate: t } = this.props;

    return (
      <Tooltip content={t('terralego.map.widget_control.content')}>
        <button type="button" onClick={toggleWidget}>
          <Icon icon="selection" />
        </button>
      </Tooltip>
    );
  }
}

export default WidgetControl;
