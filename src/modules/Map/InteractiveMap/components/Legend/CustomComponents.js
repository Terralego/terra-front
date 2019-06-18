import React from 'react';

import Circle from './components/Circle';
import Rect from './components/Rect';

const Square = ({ color, size = 10 }) => (
  <Rect color={color} size={+size} />
);

const CircleComponent = ({ color, size = 10 }) => (
  <Circle color={color} size={+size} />
);

export default [{
  tagName: 'square',
  component: Square,
  autoClose: true,
}, {
  tagName: 'circle',
  component: CircleComponent,
  autoClose: true,
}];
