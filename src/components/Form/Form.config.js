import FormSummary from 'components/Form/FormSummary';
import FormProperties from 'components/Form/FormProperties';

const FormConfig = {
  steps: [
    { title: 'Projet', component: FormProperties, index: 0 },
    { title: 'Récapitulatif', component: FormSummary, index: 1 },
  ],
  confirmation: {
    submitButton: 'Envoyer ma demande',
    modal: {
      title: 'Demande envoyée',
      actions: {
        cancel: 'Fermer',
        submit: 'Accéder au suivi de ma demande',
      },
      text: 'Votre demande a été envoyé avec succès. Suivez le status de votre demande via votre interface de suivi.',
    },
  },
};

export default FormConfig;
