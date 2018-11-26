import SignupForm from './SignupForm';
import { connectTerraFrontProvider } from '../../../TerraFrontProvider';
import { connectAuthProvider } from '../../services/context';

export default connectTerraFrontProvider({
  '*': 'modules.Auth.components.SignupForm',
})(connectAuthProvider(({
  signupAction,
}) => ({ signupAction }))(SignupForm));
