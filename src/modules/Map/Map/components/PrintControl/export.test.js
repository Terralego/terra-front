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

it('should export map as pdf', async () => {
  const parentElement = {};
  const map = {
    getContainer: jest.fn(() => ({
      parentElement,
    })),
  };
  const orientation = 'portrait';

  exportPdf(map, orientation);
  await true;

  expect(jspdf).toHaveBeenCalledWith({
    format: 'a4',
    orientation: 'portrait',
  });
  expect(html2canvas).toHaveBeenCalledWith(parentElement, expect.any(Object));
  const { ignoreElements } = html2canvas.mock.calls[0][1];
  expect(ignoreElements({ className: 'mapboxgl-control-container-top' })).toBe(true);
  expect(ignoreElements({ className: 'foo' })).toBe(false);
  expect(jspdf.instance.addImage).toHaveBeenCalledWith(html2canvas.canvas, null, 0, 0);
  expect(jspdf.instance.save).toHaveBeenCalledWith('capture.pdf');
});
