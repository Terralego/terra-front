import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

const A4 = [210, 297];
const FORMATS = {
  a4: A4,
};

export default async function exportPdf (map, orientation, format = 'a4') {
  const container = map.getContainer().parentElement;
  const canvas = map.getCanvas();
  const canvasRoot = canvas.parentNode;

  const doc = new JsPdf({ format, orientation });

  const fixedMap = await new Promise(async resolve => {
    map.once('render', () =>
      resolve(map.getCanvas().toDataURL()));
    // trigger render
    await map.setBearing(map.getBearing());
  });
  const img = new Image();
  img.src = fixedMap;
  ['position', 'width', 'height'].forEach(style => {
    img.style[style] = canvas.style[style];
  });

  canvasRoot.appendChild(img);
  canvasRoot.removeChild(canvas);

  const renderedMap = await html2canvas(container, {
    ignoreElements: el => typeof el.className === 'string' && el.className.includes('mapboxgl-control-container'),
  });

  const dims = FORMATS[format] || FORMATS.a4;

  doc.addImage(renderedMap, 'JPEG', 0, 0, ...(orientation === 'portrait' ? dims : dims.reverse()));
  doc.save(`export (${new Date(Date.now()).toLocaleDateString()}).pdf`);

  canvasRoot.removeChild(img);
  canvasRoot.appendChild(canvas);
}
