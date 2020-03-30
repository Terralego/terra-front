import compose from '../../utils/compose';
import withDeviceSize from '../../hoc/withDeviceSize';
import { connectAuthProvider } from '../../modules/Auth';

import LoginButton from './LoginButton';

export default compose(
  withDeviceSize(),
  connectAuthProvider('authenticated', 'logoutAction'),
)(LoginButton);
