import React from 'react';

import TerraFrontProvider from '../../modules/TerraFrontProvider';
import AuthProvider, { LoginForm } from '../../modules/Auth';

export const CustomLoginForm = () => (
  <TerraFrontProvider
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
  </TerraFrontProvider>
);

export default CustomLoginForm;
