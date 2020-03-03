import React from 'react';

import translateMock from '../../../utils/translate';
import './index.scss';


export const NoValues = ({
  translate = translateMock({
    'terralego.forms.controls.noValues': 'No choice available',
  }),
}) => (
  <p className="control-label-noValues">{translate('terralego.forms.controls.noValues')}</p>
);

export default NoValues;
