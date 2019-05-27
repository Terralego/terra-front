import React from 'react';
import renderer from 'react-test-renderer';

import Radios from './Radios';

it('should render correctly', () => {
  const tree = renderer.create((
    <Radios
      sublayers={[{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }]}
      onSelectionChange={() => null}
      selectedValue={0}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});
