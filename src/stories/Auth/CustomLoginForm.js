import React from 'react';

import AuthModuleProvider from '../../modules/Auth/moduleProvider';
import AuthProvider, { LoginForm } from '../../modules/Auth';

export const CustomLoginForm = () => (
  <AuthModuleProvider
    config={{
      components: {
        LoginForm: {
          render: () => (
            <p>This is an injected custom LoginFrom renderer</p>
          ),
        },
      },
    }}
  >
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  </AuthModuleProvider>
);

export default CustomLoginForm;
