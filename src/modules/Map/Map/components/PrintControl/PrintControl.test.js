import React from 'react';
import renderer from 'react-test-renderer';

import PrintControl from './PrintControl';

jest.mock('jspdf', () => ({
  default: jest.fn(),
}));
jest.mock('html2canvas', () => jest.fn());

it('should render', () => {
  const tree = renderer.create(<PrintControl />);
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should open and set classes', () => {
  const instance = new PrintControl({});
  instance.setClasses = jest.fn();
  instance.setState = jest.fn((state, fn) => fn());
  instance.handleInteraction(true);
  expect(instance.setState).toHaveBeenCalledWith({ isOpen: true }, instance.setClasses);
  expect(instance.setClasses).toHaveBeenCalled();
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
