import React from 'react';

import { LoginForm, connectAuthProvider } from '../../../modules/Auth';

export const ShouldDisplayLoginForm = connectAuthProvider(({
  authenticated, logoutAction,
}) => ({
  authenticated, logoutAction,
}))(({
  authenticated, logoutAction,
}) => (authenticated
  ? <>
    <p>Welcome !</p>
    <button onClick={logoutAction}>Logout</button>
    </>
  : <LoginForm />
));

export default ShouldDisplayLoginForm;
