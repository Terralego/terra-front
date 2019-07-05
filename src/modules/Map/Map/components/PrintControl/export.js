import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

export default async function exportPdf (map, orientation) {
  const container = map.getContainer().parentElement;

  const doc = new JsPdf({ format: 'a4', orientation });

  const canvas = await html2canvas(container, {
    ignoreElements: el => typeof el.className === 'string' && el.className.includes('mapboxgl-control-container'),
  });
  doc.addImage(canvas, null, 0, 0);
  doc.save('capture.pdf');
}
