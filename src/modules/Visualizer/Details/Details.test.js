import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Button } from '@blueprintjs/core';
import Details from './Details';
import FeatureProperties from '../../Map/FeatureProperties';

jest.useFakeTimers();

jest.mock('@blueprintjs/core', () => ({
  Button () {
    return <p>Button</p>;
  },
}));

jest.mock('../../Map/FeatureProperties', () =>
  ({ children }) => children({ properties: {} }));

it('should render correctly with content', () => {
  const tree = renderer.create((
    <Details
      visible
      interaction={{
        template:
`# Hello world
 This is {{foo}}`,
      }}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly without content', () => {
  const tree = renderer.create((
    <Details
      interaction={{
        template:
  `# Hello world
  This is {{foo}}`,
      }}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should close', () => {
  const onClose = jest.fn();
  const wrapper = shallow((
    <Details
      onClose={onClose}
    />
  ));
  wrapper.find('Button').props().onClick();
  expect(onClose).toHaveBeenCalled();
});

it('should do nothing', () => {
  const onClose = jest.fn();
  const wrapper = shallow((
    <Details features={[]} />
  ));
  wrapper.find('Button').props().onClick();
  expect(onClose).not.toHaveBeenCalled();
});

it('should get derived state from props', () => {
  const feature = {};
  const interaction = {};
  expect(Details.getDerivedStateFromProps({ feature, interaction }))
    .toEqual({ feature, interaction });
  expect(Details.getDerivedStateFromProps({ }))
    .toBeNull();
});

it('should update component', () => {
  const instance = new Details({});
  instance.updateIndex = jest.fn();
  instance.switchVisibility = jest.fn();

  instance.props.visible = true;
  instance.componentDidUpdate({
    visible: false,
  });
  expect(instance.switchVisibility).toHaveBeenCalledWith(true);
  instance.switchVisibility.mockClear();

  instance.componentDidUpdate({
    visible: true,
  });
  expect(instance.switchVisibility).not.toHaveBeenCalled();
  instance.switchVisibility.mockClear();

  instance.props.feature = { properties: { _id: 1 } };
  instance.componentDidUpdate({
    feature: {},
  });
  expect(instance.updateIndex).toHaveBeenCalledWith(1);
  instance.updateIndex.mockClear();
});

it('should get index feature', () => {
  const features = [{}, {}, {}];
  const instance = new Details({ features });
  expect(instance.getIndexFeature(0)).toBe(0);
  expect(instance.getIndexFeature(1)).toBe(1);
  expect(instance.getIndexFeature(2)).toBe(2);
  expect(instance.getIndexFeature(3)).toBe(0);
  expect(instance.getIndexFeature(-1)).toBe(2);
});

it('should switch visibility on', () => {
  const instance = new Details();
  let callback;
  instance.setState = jest.fn((state, cb) => { callback = cb; });
  instance.switchVisibility(true);
  expect(instance.setState).toHaveBeenCalledWith({
    hidden: false,
  }, callback);
  expect(clearTimeout).toHaveBeenCalledTimes(1);
  instance.setState.mockClear();
  callback();
  expect(instance.setState).toHaveBeenCalledWith({
    visible: true,
  });
});

it('should switch visibility off', () => {
  const instance = new Details();
  instance.setState = jest.fn();
  instance.switchVisibility(false);
  expect(instance.setState).toHaveBeenCalledWith({
    visible: false,
  });
  instance.setState.mockClear();
  jest.runAllTimers();
  expect(instance.setState).toHaveBeenCalledWith({ hidden: true });
});

it('should update index', () => {
  const features = [{
    _id: 1,
  }, {
    _id: 2,
  }, {
    _id: 3,
  }];
  const instance = new Details({});
  instance.setState = jest.fn();
  instance.updateIndex(1);
  expect(instance.setState).not.toHaveBeenCalled();

  instance.props.features = features;
  instance.updateIndex(1);
  expect(instance.setState).toHaveBeenCalledWith({ index: 0 });
  instance.setState.mockClear();

  instance.updateIndex(2);
  expect(instance.setState).toHaveBeenCalledWith({ index: 1 });
  instance.setState.mockClear();

  instance.updateIndex(3);
  expect(instance.setState).toHaveBeenCalledWith({ index: 2 });
  instance.setState.mockClear();

  instance.updateIndex(4);
  expect(instance.setState).toHaveBeenCalledWith({ index: -1 });
});

it('should handle change', () => {
  const features = [{}, {}, {}];
  const onChange = jest.fn();
  const instance = new Details({ features, onChange });
  instance.setState = jest.fn();

  instance.handleChange(1);
  expect(onChange).toHaveBeenCalledWith(0);
  expect(instance.setState).toHaveBeenCalledWith({ index: 0 });
  onChange.mockClear();

  instance.state.index = 0;
  instance.handleChange(1);
  expect(onChange).toHaveBeenCalledWith(1);
  expect(instance.setState).toHaveBeenCalledWith({ index: 1 });
  onChange.mockClear();

  instance.state.index = 1;
  instance.handleChange(1);
  expect(onChange).toHaveBeenCalledWith(2);
  expect(instance.setState).toHaveBeenCalledWith({ index: 2 });
  onChange.mockClear();

  instance.state.index = 2;
  instance.handleChange(1);
  expect(onChange).toHaveBeenCalledWith(0);
  expect(instance.setState).toHaveBeenCalledWith({ index: 0 });
  onChange.mockClear();

  instance.state.index = undefined;
  instance.handleChange(-1);
  expect(onChange).toHaveBeenCalledWith(2);
  expect(instance.setState).toHaveBeenCalledWith({ index: 2 });
  onChange.mockClear();

  instance.state.index = 2;
  instance.handleChange(-1);
  expect(onChange).toHaveBeenCalledWith(1);
  expect(instance.setState).toHaveBeenCalledWith({ index: 1 });
  onChange.mockClear();

  instance.state.index = 1;
  instance.handleChange(-1);
  expect(onChange).toHaveBeenCalledWith(0);
  expect(instance.setState).toHaveBeenCalledWith({ index: 0 });
  onChange.mockClear();

  instance.state.index = 0;
  instance.handleChange(-1);
  expect(onChange).toHaveBeenCalledWith(2);
  expect(instance.setState).toHaveBeenCalledWith({ index: 2 });
  onChange.mockClear();
});

it('should display a feature', () => {
  const wrapper = shallow(
    <Details
      features={[
        {}, {}, {},
      ]}
    />,
  );
  const instance = wrapper.instance();
  instance.setState({ index: 0 });
  expect(wrapper.find('.view-details__wrapper').length).toBe(1);
  const { onClick: down } = wrapper.find(Button).get(1).props;
  const { onClick: up } = wrapper.find(Button).get(2).props;
  instance.handleChange = jest.fn();

  down();
  expect(instance.handleChange).toHaveBeenCalledWith(-1);

  up();
  expect(instance.handleChange).toHaveBeenCalledWith(1);

  const { children } = wrapper.find(FeatureProperties).props();
  expect(children({})).toMatchSnapshot();
});
