import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

export default async function exportPdf (map, orientation, format = 'a4') {
  // html2canvas fails to render elements on top of page so we need to scroll
  window.scrollTo(0, 0);

  const container = map.getContainer().parentElement;
  const canvas = map.getCanvas();
  const canvasRoot = canvas.parentNode;

  const doc = new JsPdf({ format, orientation });

  // Rendering canvas to an image is needed for Chrome/Edge
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

  const renderedContainer = await html2canvas(container, {
    // Remove control container
    ignoreElements: ({ className: classes }) => typeof classes === 'string' && classes.includes('mapboxgl-control-container'),
  });

  // JsPdf will automatically detect and put the image full page
  doc.addImage(renderedContainer, 'PNG', 0, 0);
  doc.save(`export (${new Date(Date.now()).toLocaleDateString()}).pdf`);

  canvasRoot.removeChild(img);
  canvasRoot.appendChild(canvas);
}
