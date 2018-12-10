import React from 'react';
import renderer from 'react-test-renderer';

import Legend from './Legend';

it('should render correctly', () => {
  const items = [{
    label: 'Rouge',
    color: 'red',
  }, {
    label: 'Vert',
    color: 'green',
  }, {
    label: 'Bleu',
    color: 'blue',
  }];
  const tree = renderer.create(<Legend title="Hello World" items={items} />).toJSON();
  expect(tree).toMatchSnapshot();
});
