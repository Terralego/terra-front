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
    strokeColor: 'lightblue',
    shape,
  }]);

  it('square', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items()} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('circle', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items()} shape="circle" position="left" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('line', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items()} shape="line" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('stacked circles', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items()} shape="stackedCircle" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('with comment', () => {
    const tree = renderer.create(<Legend comment="Evian" title="les bains" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('should render correctly with different config', () => {
  const items = [{
    label: 'Rouge',
    color: 'red',
    size: 20,
  }, {
    label: 'Vert',
    color: 'green',
    strokeColor: 'black',
    size: 30,
  }, {
    label: 'Bleu',
    color: 'blue',
    size: 40,
    strokeColor: 'lightblue',
  }];

  it('square', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items} position="right" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('circle', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items} shape="circle" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('line', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items} shape="line" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('stacked circles', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items} shape="stackedCircle" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('should render correctly with old config', () => {
  const items = shape => ([{
    label: 'Rouge',
    color: 'red',
    shape,
  }, {
    label: 'Vert',
    color: 'green',
    radius: 20,
    shape,
  }, {
    label: 'Bleu',
    color: 'blue',
    diameter: 40,
    strokeColor: 'lightblue',
    shape,
  }]);

  it('square', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items()} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('circle', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items('circle')} position="left" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('line', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items('line')} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('stacked circles', () => {
    const tree = renderer.create(<Legend title="Hello World" items={items('circle')} stackedCircle />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('with source', () => {
    const tree = renderer.create(<Legend source="Evian" title="les bains" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
