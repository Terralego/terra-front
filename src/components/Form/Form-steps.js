import React from 'react';
import Summary from 'components/Summary/Summary';
import FormUser from 'components/Form/FormUser';

const steps = [
  { title: 'Utilisateur', component: <FormUser />, index: 0 },
  { title: 'Récapitulatif', component: <Summary />, index: 4 },
];

export default steps;
