import React from 'react';
import renderer from 'react-test-renderer';

import HomeControl from './HomeControl';

it('should render', () => {
  const tree = renderer.create(<HomeControl />);
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should go home with bounds', () => {
  const map = {
    fitBounds: jest.fn(),
  };

  const instance = new HomeControl({ map, fitBounds: [1, 2], fitBoundsParams: { padding: 10 } });
  instance.goHome();
  expect(map.fitBounds).toHaveBeenCalledWith([1, 2], { padding: 10 });
});

it('should go home with center', () => {
  const map = {
    flyTo: jest.fn(),
  };

  const instance = new HomeControl({ map, center: [1, 2] });
  instance.goHome();
  expect(map.flyTo).toHaveBeenCalledWith({ center: [1, 2], zoom: 7 });
});

it('should not go home', () => {
  const map = {
    flyTo: jest.fn(),
    fitBounds: jest.fn(),
  };

  const instance = new HomeControl({ map });
  instance.goHome();
  expect(map.flyTo).not.toHaveBeenCalled();
  expect(map.fitBounds).not.toHaveBeenCalled();
});
