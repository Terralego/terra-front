import React from 'react';
import Summary from 'components/Summary/Summary';
import FormProperties from 'components/Form/FormProperties';

const steps = [
  { title: 'Projet', component: <FormProperties />, index: 0 },
  { title: 'Récapitulatif', component: <Summary />, index: 1 },
];

export default steps;
