import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

export default async function exportPdf (map, orientation, format = 'a4') {
  // html2canvas fails to render elements on top of page so we need to scroll
  window.scrollTo(0, 0);

  // Increase DPI temporarily
  const dpi = 300;
  const actualPixelRatio = window.devicePixelRatio;
  Object.defineProperty(window, 'devicePixelRatio', {
    get: () => dpi / 96,
  });

  const container = map.getContainer().parentElement;
  const canvas = map.getCanvas();
  const canvasRoot = canvas.parentNode;

  const doc = new JsPdf({ format, orientation, units: 'mm' });

  // Rendering canvas to an image is needed for Chrome/Edge
  // eslint-disable-next-line no-async-promise-executor
  const fixedMap = await new Promise(async resolve => {
    map.once('render', () => resolve(map.getCanvas().toDataURL()));
    // trigger render by resizing so that new devicePixelRatio is handled
    map.resize();
  });
  const img = new Image();
  img.src = fixedMap;
  ['position', 'width', 'height'].forEach(style => {
    img.style[style] = canvas.style[style];
  });

  canvasRoot.appendChild(img);
  canvasRoot.removeChild(canvas);

  const renderedContainer = await html2canvas(container, {
    // Remove control container
    ignoreElements: ({ className: classes }) => typeof classes === 'string' && classes.includes('mapboxgl-control-container'),
  });

  // Convert canvas' dimensions from pixels to milimeters
  const conversionFactor = 96 / 25.4;
  const widthInmm = parseFloat(canvas.style.width) / conversionFactor;
  const heightInmm = parseFloat(canvas.style.height) / conversionFactor;

  // Put the image full page
  doc.addImage(renderedContainer, 'PNG', 0, 0, widthInmm, heightInmm);
  doc.save(`export (${new Date(Date.now()).toLocaleDateString()}).pdf`);

  // Set back previous DPI, map will be resized back by control
  Object.defineProperty(window, 'devicePixelRatio', {
    get: () => actualPixelRatio,
  });

  canvasRoot.removeChild(img);
  canvasRoot.appendChild(canvas);
}
