import React from 'react';
import renderer from 'react-test-renderer';

import SearchInput from './SearchInput';

it('should render', () => {
  const tree = renderer.create(<SearchInput />).toJSON();
  expect(tree).toMatchSnapshot();
});
