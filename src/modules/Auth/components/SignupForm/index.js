import SignupForm from './SignupForm';
import { connectTerraFrontProvider } from '../../../TerraFrontProvider';
import { connectAuthProvider } from '../../services/context';

export default connectTerraFrontProvider(({
  components: { SignupForm: SignupFormProps = {} } = {},
}) => SignupFormProps)(connectAuthProvider(({
  signupAction,
}) => ({ signupAction }))(SignupForm));
