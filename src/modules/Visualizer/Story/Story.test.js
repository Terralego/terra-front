import React from 'react';
import renderer from 'react-test-renderer';

import Story from './Story';
import { toggleLayerVisibility } from '../../Map/services/mapUtils';

jest.mock('../../Map/services/mapUtils', () => ({
  toggleLayerVisibility: jest.fn(),
}));

const story = {
  beforeEach: [{
    layers: [
      'foo-*',
      'bar',
    ],
    active: false,
  }],
  slides: [{
    title: 'Slide 1',
    content: `
  <p>
    Content 1
  </p>
`,
  }, {
    title: 'Slide 2',
    content: `
<p>
  Content 2
</p>
`,
    layouts: [{
      layers: ['foo-1a', 'foo-1b'],
      active: true,
    }],
  }, {
    title: 'Slide 3',
    content: `
<p>
  Content 3
</p>
`,
    layouts: [{
      layers: ['foo-2'],
      active: true,
    }],
    legends: [{
      title: 'Legend 1',
      items: [
        { label: 'a', color: '#ff8c00' },
        { label: 'b', color: '#965096' },
        { label: 'c', color: '#ff78a0' },
        { label: 'd', color: '#003c82' },
        { label: 'e', color: '#f5000a' },
        { label: 'f', color: '#c8be00' },
        { label: 'g', color: '#90ff77' },
        { label: 'h', color: '#007dff' },
        { label: 'i', color: '#1e6414' },
      ],
    }],
  }, {
    title: 'Slide 4',
    content: `
<p>
  Content 4
</p>
    `,
    layouts: [{
      layers: ['foo-3'],
      active: true,
    }],
    legends: [{
      title: 'Legend 2',
      items: [
        { label: '1', color: '#b91a1c' },
        { label: '2', color: '#b3de69' },
        { label: '3', color: '#1f78b4' },
        { label: '4', color: '#a6a5ae' },
        { label: '5', color: '#ec7c30' },
        { label: '6', color: '#fedb2a' },
        { label: '7', color: '#8fa9db' },
        { label: '8', color: '#9e480d' },
      ],
    }],
  }, {
    title: 'Slide 5',
    content: `
<p>
  Content 5
</p>
`,
    layouts: [{
      layers: ['foo-4'],
      active: true,
    }],
    legends: [{
      title: 'Legend 3',
      items: [
        { label: 'a', color: '#fcbba1', shape: 'circle', radius: 5 },
        { label: 'aa', color: '#fc9272', shape: 'circle', radius: 10 },
        { label: 'aaa', color: '#fb6a4a', shape: 'circle', radius: 15 },
        { label: 'aaaa', color: '#ef3b2c', shape: 'circle', radius: 20 },
        { label: 'aaaaa', color: '#cb181d', shape: 'circle', radius: 25 },
        { label: 'aaaaaa', color: '#99000d', shape: 'circle', radius: 30 },
      ],
    }],
  }, {
    title: 'Slide 6',
    content: `
<p>
  Content 6
</p>
`,
    layouts: [{
      layers: ['bar'],
      active: true,
    }],
  }],
};

it('should render', () => {
  const tree = renderer.create(
    <Story
      story={story}
    />,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render a step', () => {
  const tree = renderer.create(
    <Story
      story={story}
    />,
  );
  tree.getInstance().setState({ step: 1 });
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render last step', () => {
  const tree = renderer.create(
    <Story
      story={story}
    />,
  );
  tree.getInstance().setState({ step: 5 });
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should init map on mount and update', () => {
  const instance = new Story({});
  instance.initMap = jest.fn();
  instance.displayStep = () => null;

  instance.componentDidUpdate({ map: {} }, {});
  expect(instance.initMap).toHaveBeenCalled();
  instance.initMap.mockClear();

  instance.componentDidUpdate({}, {});
  expect(instance.initMap).not.toHaveBeenCalled();
});

it('should update step', () => {
  const instance = new Story({});
  instance.displayStep = jest.fn();

  instance.componentDidUpdate({ map: {} }, {});
  expect(instance.displayStep).toHaveBeenCalled();
  instance.displayStep.mockClear();

  instance.props.map = {};
  instance.componentDidUpdate({ map: instance.props.map }, { step: 1 });
  expect(instance.displayStep).toHaveBeenCalled();
  instance.displayStep.mockClear();

  instance.state.step = 1;
  instance.componentDidUpdate({ map: instance.props.map }, { step: 1 });
  expect(instance.displayStep).not.toHaveBeenCalled();
});

it('should set prev step', () => {
  const instance = new Story({
    story,
  });
  let callback;
  instance.setState = jest.fn(fn => { callback = fn; });
  instance.prevStep();
  expect(instance.setState).toHaveBeenCalledWith(expect.any(Function));

  expect(callback({ step: 5 })).toEqual({ step: 4 });
  expect(callback({ step: 4 })).toEqual({ step: 3 });
  expect(callback({ step: 3 })).toEqual({ step: 2 });
  expect(callback({ step: 2 })).toEqual({ step: 1 });
  expect(callback({ step: 1 })).toEqual({ step: 0 });
  expect(callback({ step: 0 })).toEqual({ step: 5 });
});

it('should set next step', () => {
  const instance = new Story({
    story,
  });
  let callback;
  instance.setState = jest.fn(fn => { callback = fn; });
  instance.nextStep();
  expect(instance.setState).toHaveBeenCalledWith(expect.any(Function));

  expect(callback({ step: 5 })).toEqual({ step: 0 });
  expect(callback({ step: 4 })).toEqual({ step: 5 });
  expect(callback({ step: 3 })).toEqual({ step: 4 });
  expect(callback({ step: 2 })).toEqual({ step: 3 });
  expect(callback({ step: 1 })).toEqual({ step: 2 });
  expect(callback({ step: 0 })).toEqual({ step: 1 });
});

it('should update map', () => {
  const instance = new Story({});
  instance.displayStep = jest.fn();
  instance.initMap();
  expect(instance.displayStep).not.toHaveBeenCalled();

  instance.props.map = {};

  instance.initMap();
  expect(instance.displayStep).toHaveBeenCalled();
});

it('should display step', () => {
  const setLegends = jest.fn();
  const map = {
    getStyle: () => ({
      layers: [{
        id: 'foo-1a',
      }, {
        id: 'foo-1b',
      }, {
        id: 'foo-2',
      }, {
        id: 'foo-3',
      }, {
        id: 'foo-4',
      }, {
        id: 'bar',
      }, {
        id: 'bapapa',
      }],
    }),
  };
  const instance = new Story({ story, setLegends });
  instance.displayStep();
  expect(toggleLayerVisibility).not.toHaveBeenCalled();

  instance.props.map = map;
  instance.displayStep();
  expect(toggleLayerVisibility).toHaveBeenCalledTimes(1);
  expect(setLegends).toHaveBeenCalled();
  toggleLayerVisibility.mockClear();

  instance.state.step = 1;
  instance.displayStep();
  expect(toggleLayerVisibility).toHaveBeenCalledTimes(3);
  toggleLayerVisibility.mockClear();

  instance.props.story.beforeEach = [{}];
  instance.displayStep();
  expect(toggleLayerVisibility).toHaveBeenCalledTimes(2);
  toggleLayerVisibility.mockClear();

  instance.props.story.beforeEach = undefined;
  instance.displayStep();
  expect(toggleLayerVisibility).toHaveBeenCalledTimes(2);
  toggleLayerVisibility.mockClear();
});
