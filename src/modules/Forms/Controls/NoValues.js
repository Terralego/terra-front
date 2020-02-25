import React from 'react';

import './index.scss';

export const NoValues = ({ label }) => (
  <div className="control-container">
    <p className="control-label">{label}</p>
    <p className="control-label-noValues">Aucun choix disponible</p>
  </div>
);

export default NoValues;
