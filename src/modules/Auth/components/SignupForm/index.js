import compose from '../../../../utils/compose';
import SignupForm from './SignupForm';
import { connectTerraFrontProvider } from '../../../TerraFrontProvider';
import { connectAuthProvider } from '../../services/context';

export default compose(
  connectTerraFrontProvider({ '*': 'modules.Auth.components.SignupForm' }),
  connectAuthProvider(({ signupAction }) => ({ signupAction })),
)(SignupForm);
