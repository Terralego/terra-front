import FormWhere from 'components/Form/FormWhere';
import FormProject from 'components/Form/FormProject';

const FormConfig = {
  steps: [
    { title: 'Projet', component: FormProject },
    { title: 'Where', component: FormWhere },
  ],
  confirmation: {
    editButton: 'Modifier ma demande',
    submitButton: 'Envoyer ma demande',
    errorText: 'Une erreur est survenue, merci de retenter l\'envoi. Si l\'erreur persiste, vous pouvez nous contacter.',
    modal: {
      title: 'Demande envoyée',
      action: 'Accéder au suivi de ma demande',
      text: 'Votre demande a été envoyé avec succès. Suivez le status de votre demande via votre interface de suivi.',
    },
  },
  status: [
    { id: 0, title: 'Approuvée' },
    { id: 1, title: 'Refusée' },
  ],
};

export default FormConfig;
