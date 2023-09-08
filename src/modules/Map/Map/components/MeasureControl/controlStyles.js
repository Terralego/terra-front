export const drawStyles = [
  {
    id: 'gl-draw-line',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#f4900c',
      'line-dasharray': [3, 3],
      'line-width': 2,
    },
  },

  // vertex point halos
  {
    id: 'gl-draw-polygon-and-line-vertex-halo',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#eee',
    },
  },

  // vertex points
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static'], ['==', 'active', 'true']],
    paint: {
      'circle-radius': 4,
      'circle-color': '#f4900c',
    },
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-inactive',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static'], ['!=', 'active', 'true']],
    paint: {
      'circle-radius': 3,
      'circle-color': '#cccccc',
    },
  },
];


export const wrapperStyle = {
  marginTop: 8,
  marginLeft: 0,
  float: 'left',
  clear: 'both',
  pointerEvents: 'auto',
  transform: 'translate(0)',
};

export const drawButtonStyle = {
  paddingTop: 5,
  paddingRight: 5,
  paddingBottom: 2,
  paddingLeft: 5,
};

export const measureStyle = {
  marginTop: 2,
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  background: 'rgb(68, 83, 95, 0.8)',
  minWidth: 150,
  borderRadius: 3,
};

export const measureListStyle = {
  margin: 0,
};

export const numStyle = {
  fontFamily: 'monospace',
  textAlign: 'right',
  marginLeft: 0,
};

export const unitStyle = {
  display: 'inline-block',
  width: '1.2rem',
  textAlign: 'left',
  marginLeft: '0.25rem',
};

export const closeMeasureStyle = {
  position: 'absolute',
  right: 0,
  top: 0,
};
