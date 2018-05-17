import FormSummary from 'components/Form/FormSummary';
import FormProperties from 'components/Form/FormProperties';

const FormConfig = {
  steps: [
    { title: 'Projet', component: FormProperties, index: 0 },
    { title: 'Récapitulatif', component: FormSummary, index: 1 },
  ],
  confirmation: {
    submitButton: 'Envoyer ma demande',
    errorText: 'Une erreur est survenue, merci de retenter l\'envoi. Si l\'erreur persiste, vous pouvez nous contacter.',
    modal: {
      title: 'Demande envoyée',
      action: 'Accéder au suivi de ma demande',
      text: 'Votre demande a été envoyé avec succès. Suivez le status de votre demande via votre interface de suivi.',
    },
  },
};

export default FormConfig;
