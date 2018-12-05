import React from 'react';
import renderer from 'react-test-renderer';

import Api from '../../';
import ApiProvider from './';

it('should render children correctly', () => {
  const Div = () => <div>Test</div>;
  const divRendered = renderer.create(<Div />).toJSON();
  const WrappedDiv = () => <ApiProvider host="host"><Div /></ApiProvider>;
  const wrappedDivRenderer = renderer.create(<WrappedDiv />).toJSON();

  expect(divRendered).toEqual(wrappedDivRenderer);
  expect(wrappedDivRenderer).toMatchSnapshot();
  expect(Api.host).toBe('host');
});
