const getUpdateParameters = layer => {
  const { fields, ...advancedStyle } = layer.advanced_style;
  const usableFields = fields.filter(field => field.use);
  return { fields: usableFields, advancedStyle };
};

const donutSegment = (start, pEnd, r, color, r0 = 0) => {
  let end = pEnd;
  if (end - start === 1) end -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end - 0.25);
  const x0 = Math.cos(a0);
  const y0 = Math.sin(a0);
  const x1 = Math.cos(a1);
  const y1 = Math.sin(a1);
  const largeArc = end - start > 0.5 ? 1 : 0;

  // draw an SVG path
  const draw = [
    `M ${r + r0 * x0} ${r + r0 * y0}`,
    `L ${r + r * x0} ${r + r * y0}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1}`,
    `L ${r + r0 * x1} ${r + r0 * y1}`,
    `A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${r + r0 * y0}`,
  ].join(' ');
    // draw an SVG path
  return `<path d="${draw}" fill="${color}" />`;
};

const createMarker = (
  props,
  {
    fields = [],
    advancedStyle: { show_total: showTotal },
  },
  { 'circle-radius': circleRadius = 30, 'circle-opacity': circleOpacity = 1 },
) => {
  const offsets = [];
  let total = 0;
  fields.forEach(field => {
    offsets.push(total);
    total += props[field.name];
  });

  const r = circleRadius === 0 ? 30 : circleRadius;
  const fontSize = 15;
  const w = r * 2;

  let html = `<div style="z-index:${10 - Math.round(r / 10)}">
      <svg
        opacity=${circleOpacity}
        width="${w}"
        height="${w}"
        viewbox="0 0 ${w} ${w}"
        text-anchor="middle"
        style="font: ${fontSize}px sans-serif; display: block"
      >`;

  for (let i = 0; i < fields.length; i += 1) {
    html += donutSegment(
      offsets[i] / total,
      (offsets[i] + props[fields[i].name]) / total,
      r,
      fields[i].color,
    );
  }
  if (showTotal) {
    html += `
        <text dominant-baseline="central" transform="translate(${r}, ${r})">
          ${total.toLocaleString()}
        </text>`;
  }

  html += `
      </svg>
    </div>`;

  const el = document.createElement('div');
  el.innerHTML = html;
  return el.firstChild;
};

const updateLayerOpacity = (marker, opacity) => {
  marker.getElement().children[0].setAttribute('opacity', opacity);
};

export default {
  type: 'piechart',
  targetType: 'circle',
  defaultPaint: {
    'circle-opacity': 1,
    'circle-color': '#ffffff',
    'circle-radius': 0,
  },
  getUpdateParameters,
  createMarker,
  updateLayerOpacity,
};
