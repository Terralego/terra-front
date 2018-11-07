import React from 'react';
import { shallow } from 'enzyme';
import Authentified from './';
import AuthProvider from '../AuthProvider';

const MOCKED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0Mn0sImV4cCI6MTUxNjIzOTAyMn0.mPABaxD6A5yFiIFWjNDFFEhtDsrtDPVsDKHCW6ljCNs';

it('should get authentified state', () => {
  let expected;
  global.localStorage.setItem('tf:auth:token', MOCKED_TOKEN);
  const wrapper = shallow((
    <AuthProvider>
      <Authentified>
        {({ authentified }) => {
          expected = authentified;
          return null;
        }}
      </Authentified>
    </AuthProvider>
  ));
  wrapper.html();
  expect(expected).toBe(true);
});
