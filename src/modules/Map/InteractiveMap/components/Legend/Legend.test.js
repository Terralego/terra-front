import React from 'react';
import renderer from 'react-test-renderer';

import Legend from './Legend';

describe('should render correctly', () => {
  const items = shape => ([{
    label: 'Rouge',
    color: 'red',
    shape,
  }, {
    label: 'Vert',
    color: 'green',
    shape,
  }, {
    label: 'Bleu',
    color: 'blue',
    shape,
  }]);
  it('square', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items()} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('circle', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items('circle')} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
