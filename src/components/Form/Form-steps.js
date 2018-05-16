import React from 'react';
import FormSummary from 'components/Form/FormSummary';
import FormProperties from 'components/Form/FormProperties';

const steps = [
  { title: 'Projet', component: <FormProperties />, index: 0 },
  { title: 'Récapitulatif', component: <FormSummary />, index: 1 },
];

export default steps;
