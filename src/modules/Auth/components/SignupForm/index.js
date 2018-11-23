import SignupForm from './SignupForm';
import { connectModuleProvider } from '../../../TerraFrontProvider';
import { connectAuthProvider } from '../../services/context';

export default connectModuleProvider(({
  components: { SignupForm: SignupFormProps = {} } = {},
}) => SignupFormProps)(connectAuthProvider(({
  signupAction,
}) => ({ signupAction }))(SignupForm));
