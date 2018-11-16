import LoginForm from './LoginForm';
import { connectModuleProvider } from '../../../TerraFrontProvider';
import { connectAuthProvider } from '../../services/context';

export default connectModuleProvider(({
  components: { LoginForm: LoginFormProps = {} } = {},
}) => LoginFormProps)(connectAuthProvider(({
  authAction,
}) => ({ authAction }))(LoginForm));
