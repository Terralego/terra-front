import React from 'react';
import renderer from 'react-test-renderer';

import { saveAs } from 'file-saver';
import CaptureControl from './CaptureControl';


jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

it('should render', () => {
  const tree = renderer.create(
    <CaptureControl />,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should capture screen', async () => {
  const data = {};
  const canvas = { toBlob: jest.fn(callback => callback(data)) };
  const map = {
    getCanvas: jest.fn(() => canvas),
    once: jest.fn((s, f) => f()),
    setBearing: jest.fn(() => null),
    getBearing: jest.fn(() => {}),
  };
  const instance = new CaptureControl({ map });
  await instance.captureScreen();
  expect(map.once).toHaveBeenCalled();
  expect(map.getCanvas).toHaveBeenCalled();
  expect(canvas.toBlob).toHaveBeenCalled();
  expect(map.setBearing).toHaveBeenCalled();
  expect(map.getBearing).toHaveBeenCalled();
  expect(saveAs).toHaveBeenCalledWith(data, 'map_screenshot.png');
});
