import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export const NoValues = ({ label }) => (
  <div className="control-container">
    <p className="control-label">{label}</p>
    <p className="control-label-noValues">Aucun choix disponible</p>
  </div>
);

Text.propTypes = {
  label: PropTypes.string,
};

Text.defaultProps = {
  label: '',
};

export default NoValues;
