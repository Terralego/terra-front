import React from 'react';
import PropTypes from 'prop-types';
import { Callout } from '@blueprintjs/core';

import { MAX_SIZE } from '../services/search';
import translateMock from '../../../utils/translate';

import './styles.scss';

export const TooManyResults = ({ count, translate }) => count >= MAX_SIZE && (
  <Callout className="too-many-results">
    {translate('terralego.visualizer.too_many_results_count', { count })}
  </Callout>
);

TooManyResults.propTypes = {
  count: PropTypes.number.isRequired,
  translate: PropTypes.func,
};
TooManyResults.defaultProps = {
  translate: translateMock({
    'terralego.visualizer.too_many_results': 'Your query contains too many results, please change your request or zoom on a closer zone.',
  }),
};

export default TooManyResults;
