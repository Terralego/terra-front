import React from 'react';
import renderer from 'react-test-renderer';
import FiltersPanelContent from './FiltersPanelContent';

jest.useFakeTimers();

it('should render correctly', () => {
  const tree = renderer.create((
    <>
      <FiltersPanelContent layer={{}} />
      <FiltersPanelContent layer={{ filters: { form: [] } }} />
      <FiltersPanelContent
        left={42}
        width={42}
        layer={{
          filters: {
            form: [{
              type: 'range',
              property: 'foo',
            }, {
              type: 'single',
              property: 'bar',
            }],
          },
        }}
      />
    </>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should animate on mount', () => {
  const instance = new FiltersPanelContent({});
  instance.animate = jest.fn();
  instance.componentDidUpdate({});
  expect(instance.animate).not.toHaveBeenCalled();
  instance.componentDidUpdate({ visible: true });
  expect(instance.animate).toHaveBeenCalled();
});

it('should animate', () => {
  const instance = new FiltersPanelContent({ visible: true });
  instance.setState = jest.fn();

  instance.animate();
  expect(instance.setState).toHaveBeenCalledWith({
    animate: true,
  });
  expect(instance.setState).toHaveBeenCalledTimes(1);
  instance.setState.mockClear();

  jest.runAllTimers();

  expect(instance.setState).toHaveBeenCalledWith({
    visible: true,
  });
  expect(instance.setState).toHaveBeenCalledTimes(1);
  instance.setState.mockClear();

  instance.props.visible = false;
  instance.animate();
  expect(instance.setState).toHaveBeenCalledWith({
    visible: false,
  });
  expect(instance.setState).toHaveBeenCalledTimes(1);
  instance.setState.mockClear();

  jest.runAllTimers();

  expect(instance.setState).toHaveBeenCalledWith({
    animate: false,
  });
  expect(instance.setState).toHaveBeenCalledTimes(1);
  instance.setState.mockClear();
});
