import React from 'react';

import TerraFrontProvider from '../../../modules/TerraFrontProvider';
import AuthProvider, { LoginForm } from '../../../modules/Auth';

export const CustomLoginForm = () => (
  <TerraFrontProvider
    config={{
      modules: {
        Auth: {
          components: {
            LoginForm: {
              render: ({ submit, setLogin, setPassword }) => (
                <form onSubmit={submit}>
                  <select
                    onChange={setLogin}
                  >
                    <option value="admin@user">Admin</option>
                    <option value="user@user">User</option>
                  </select>
                  <input type="password" onChange={setPassword} />
                  <button>Connect</button>
                </form>
              ),
            },
          },
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
