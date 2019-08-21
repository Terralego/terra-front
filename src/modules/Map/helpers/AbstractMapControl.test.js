import React from 'react';
import ReactDOM from 'react-dom';

import AbstractMapControl from './AbstractMapControl';

class TestControl extends AbstractMapControl {
  static containerClassName = 'mocked-classname'

  render () {
    return <p>Mocker Control</p>;
  }
}
it('should be added on map', () => {
  const map = {};
  const instance = new TestControl({
    foo: 'foo',
    bar: 'bar',
  });
  instance.renderContainer = jest.fn();
  instance.onAdd(map);
  expect(instance.renderContainer).toHaveBeenCalled();
  expect(instance.container.className).toContain('mocked-classname');
});

it('should be removed from map', () => {
  const instance = new TestControl();
  instance.container = {
    parentNode: {
      removeChild: jest.fn(),
    },
  };
  ReactDOM.unmountComponentAtNode = jest.fn();
  instance.onRemove();
  expect(instance.container.parentNode.removeChild).toHaveBeenCalledWith(instance.container);
  expect(instance.map).not.toBeDefined();
  expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledWith(instance.container);
});

it('should render container', () => {
  ReactDOM.render = jest.fn();
  const instance = new TestControl();
  instance.renderContainer();
  expect(ReactDOM.render).toHaveBeenCalled();
});

it('should set props', () => {
  const instance = new TestControl();
  instance.renderContainer = jest.fn();
  instance.setProps({
    foo: 'foo',
    bar: 'bar',
  });
  expect(instance.props).toEqual({ foo: 'foo', bar: 'bar' });
  expect(instance.renderContainer).toHaveBeenCalled();
});

it('should render a disabled control', () => {
  const instance = new TestControl({ disabled: true });
  instance.onAdd({});
  expect(instance.container.className).toContain('mapboxgl-ctrl--disabled');
});
