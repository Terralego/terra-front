import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Button } from '@blueprintjs/core';

import PrintControl from './PrintControl';
import exportPdf from './export';

jest.mock('jspdf', () => ({
  default: jest.fn(),
}));
jest.mock('html2canvas', () => jest.fn());
jest.mock('./export', () => jest.fn());
jest.useFakeTimers();

it('should render', () => {
  const tree = renderer.create(<PrintControl />);
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render exporting', () => {
  const tree = renderer.create(<PrintControl />);
  tree.getInstance().setState({ isExporting: true });
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should open and set classes', () => {
  const onToggle = jest.fn();
  const instance = new PrintControl({ onToggle });
  instance.setClasses = jest.fn();
  instance.setState = jest.fn((state, fn) => fn());
  instance.handleInteraction(true);
  expect(instance.setState).not.toBeCalled();
  jest.advanceTimersByTime(500);
  expect(instance.setState).toBeCalled();
  expect(instance.setState).toHaveBeenCalledTimes(1);
  expect(instance.setState).toHaveBeenCalledWith({ isOpen: true }, instance.setClasses);
  expect(instance.setClasses).toHaveBeenCalled();
  expect(onToggle).toHaveBeenCalledWith(true);
});

it('should resize map', () => {
  const container = {
    className: 'visualizer visualizer-class',
  };
  const map = {
    getContainer: jest.fn(() => ({ parentElement: container })),
    resize: jest.fn(),
  };
  const instance = new PrintControl({ map });
  instance.popoverRef = { current: { reposition: jest.fn() } };
  instance.state = {
    isOpen: true,
  };
  instance.setClasses();
  expect(map.resize).toHaveBeenCalled();
  expect(instance.popoverRef.current.reposition).toHaveBeenCalled();
  expect(container.className).toBe('visualizer visualizer-class visualizer__print visualizer__print--landscape');
});

it('should handle disposition', () => {
  const instance = new PrintControl({});
  instance.setState = jest.fn();
  instance.handleDisposition({ target: { value: 'portrait' } });
  expect(instance.setState).toHaveBeenCalledWith({
    orientation: 'portrait',
  }, instance.setClasses);
});

it('should begin generation', async () => {
  const map = {};
  const instance = new PrintControl({ map });
  instance.state = {
    orientation: 'portrait',
  };
  instance.setState = jest.fn();
  instance.beginGeneration();

  expect(instance.setState).toHaveBeenCalledWith({
    isExporting: true,
  }, expect.any(Function));

  const callback = instance.setState.mock.calls[0][1];
  instance.setState.mockClear();

  await callback();

  expect(exportPdf).toHaveBeenCalledWith(map, 'portrait');

  expect(instance.setState).toHaveBeenCalledWith({
    isOpen: false,
    isExporting: false,
  }, instance.setClasses);
});

it('should set classes', () => {
  const container = {
    className: '',
  };
  const map = {
    resize: jest.fn(),
    getContainer: () => ({ parentElement: container }),
  };

  const instance = new PrintControl({ map });
  instance.popoverRef = {
    current: {
      reposition: jest.fn(),
    },
  };
  instance.state = {
    orientation: 'portrait',
    isOpen: true,
  };
  instance.setClasses();

  expect(instance.popoverRef.current.reposition).toHaveBeenCalled();
  expect(map.resize).toHaveBeenCalled();
  expect(container.className).toBe('visualizer__print visualizer__print--portrait');

  instance.state = {
    orientation: 'landscape',
    isOpen: true,
  };
  instance.setClasses();

  expect(container.className).toBe('visualizer__print visualizer__print--landscape');
});

it('should close menu', () => {
  const instance = new PrintControl({ translate () {} });
  instance.setState = jest.fn();
  const Content = () => instance.renderContent();
  const wrapper = shallow(<Content />);
  const closeBtnCallback = wrapper.find(Button).get(1).props.onClick;
  closeBtnCallback();
  expect(instance.setState).toHaveBeenCalledWith({ isOpen: false });
});
