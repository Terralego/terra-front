import React from 'react';

import TerraFrontProvider from '../../modules/TerraFrontProvider';
import AuthProvider, { SignupForm } from '../../modules/Auth';

export const CustomSignupForm = () => (
  <TerraFrontProvider
    config={{
      modules: {
        Auth: {
          components: {
            SignupForm: {
              render: ({ submit, setSignupProperty }) => (
                <form onSubmit={submit}>
                  <p>Email <input id="email" type="text" onChange={setSignupProperty} /></p>
                  <p>Password <input id="password" type="password" onChange={setSignupProperty} /></p>
                  <button>Create</button>
                </form>
              ),
            },
          },
        },
      },
    }}
  >
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  </TerraFrontProvider>
);

export default CustomSignupForm;
