import LoginForm from './LoginForm';
import { connectTerraFrontProvider } from '../../../TerraFrontProvider';
import { connectAuthProvider } from '../../services/context';

export default connectTerraFrontProvider(({
  components: { LoginForm: LoginFormProps = {} } = {},
}) => LoginFormProps)(connectAuthProvider(({
  authAction,
}) => ({ authAction }))(LoginForm));
