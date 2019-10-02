import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

import exportPdf from './export';

jest.mock('jspdf', () => {
  const instance = {
    addImage: jest.fn(),
    save: jest.fn(),
  };
  const jspdfMock = jest.fn(() => instance);
  jspdfMock.instance = instance;
  return jspdfMock;
});
jest.mock('html2canvas', () => {
  const canvas = {};
  const html2canvasMock = jest.fn(() => canvas);
  html2canvasMock.canvas = canvas;
  return html2canvasMock;
});

let toLocaleDateString;
beforeEach(() => {
  // eslint-disable-next-line prefer-destructuring
  toLocaleDateString = Date.prototype.toLocaleDateString;
  // eslint-disable-next-line no-extend-native
  Date.prototype.toLocaleDateString = () => 'mocked date';
});
afterEach(() => {
  // eslint-disable-next-line no-extend-native
  Date.prototype.toLocaleDateString = toLocaleDateString;
});

it('should export map as pdf', async () => {
  window.scrollTo = jest.fn();
  const parentElement = {};
  const canvas = {
    style: {
      width: `${210 * 96 / 25.4}px`,
      height: `${297 * 96 / 25.4}px`,
    },
    parentNode: {
      appendChild () {},
      removeChild () {},
    },
    toDataURL: jest.fn(() => 'dataurl'),
  };
  const listeners = [];
  const map = {
    getContainer: jest.fn(() => ({
      parentElement,
    })),
    getCanvas: jest.fn(() => canvas),
    resize () {
      expect(window.devicePixelRatio).toBe(300 / 96);
    },
    once: (e, listener) => listeners.push(listener),
  };

  const orientation = 'portrait';

  exportPdf(map, orientation);

  expect(map.getContainer).toHaveBeenCalled();
  expect(map.getCanvas).toHaveBeenCalled();
  expect(window.scrollTo).toHaveBeenCalled();
  expect(jspdf).toHaveBeenCalledWith({
    format: 'a4',
    orientation: 'portrait',
    units: 'mm',
  });

  await listeners[0]();
  await true;
  await true;
  await true;

  expect(html2canvas).toHaveBeenCalledWith(parentElement, {
    ignoreElements: expect.any(Function),
  });

  const { ignoreElements } = html2canvas.mock.calls[0][1];
  expect(ignoreElements({ className: 'mapboxgl-control-container-top' })).toBe(true);
  expect(ignoreElements({ className: 'foo' })).toBe(false);

  expect(jspdf.instance.addImage).toHaveBeenCalledWith(html2canvas.canvas, 'PNG', 0, 0, 210, 297);
  expect(jspdf.instance.save).toHaveBeenCalledWith('export (mocked date).pdf');
  expect(window.devicePixelRatio).toBe(1);
});
