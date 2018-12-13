import React from 'react';
import PropTypes from 'prop-types';
import  { RadarChart, CircularGridLines } from 'react-vis';
import './styles.scss';

PropTypes.shape({
  name: PropTypes.string.isRequired,
  getValue: PropTypes.func,
  domain: PropTypes.arrayOf([PropTypes.number]).isRequired,
  tickFormat: PropTypes.func,
});

const Radar = ({ data, width, height }) => (
  <RadarChart
    data={data}
    domains={data.domain}
    width={width}
    height={height}
    margin={width / 10}
    style={{
      axes: {
        line: {},
        ticks: {},
        text: {},
      },
      labels: {
        fontSize: 10,
      },
      polygons: {
        strokeWidth: 0.5,
        strokeOpacity: 0.8,
        fillOpacity: 0.1,
      },
    }}
  >
    <CircularGridLines
      tickValues={[...new Array(10)].map((v, i) => i / 10 - 1)}
    />
  </RadarChart>
);
export default Radar;
