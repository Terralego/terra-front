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

  it('with multi level', () => {
    const tree = renderer.create((
      <Legend
        title="level1"
        items={[{
          label: 'level1.1',
          color: 'red',
        }, {
          label: 'level1.2',
          color: 'blue',
        }, {
          label: 'level2',
          items: [{
            label: 'level2.1',
            color: 'red',
          }, {
            label: 'level2.2',
            color: 'blue',
          }, {
            label: 'level3',
            items: [{
              label: 'level3.1',
              color: 'red',
            }, {
              label: 'level3.2',
              color: 'blue',
            }, {
              label: 'level4',
              items: [{
                label: 'level4.1',
                color: 'red',
              }, {
                label: 'level4.2',
                color: 'blue',
              }],
            }],
          }],
        }]}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
