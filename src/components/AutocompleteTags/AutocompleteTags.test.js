/* eslint
  react/no-render-return-value: off
*/

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils'; // ES6

import AutocompleteTags from './AutocompleteTags';

const dataSource = [{
  value: 'sport',
  label: 'Activités sportives',
  children:
    [
      {
        value: 'hiking',
        label: 'Randonnée pédestre',
      },
      {
        value: 'trail',
        label: 'Trail',
      },
      {
        value: 'nordic_walk',
        label: 'Marche nordique',
      },
    ],
},
{
  value: 'shooting',
  label: 'Tournages ou prises de vues',
  children:
    [
      {
        value: 'film',
        label: 'Tournages de films',
      },
      {
        value: 'camera',
        label: 'Prises de vues photographiques',
      },
    ],
}];

const handleSelect = () => jest.fn();

describe('AutocompleteTags', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AutocompleteTags options={dataSource} onSelect={handleSelect} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  let div;
  let screen;
  let input;

  beforeEach(() => {
    div = document.createElement('div');
    screen = ReactDOM.render(<AutocompleteTags
      options={dataSource}
      onSelect={handleSelect}
    />, div);
    input = ReactTestUtils.findRenderedDOMComponentWithClass(screen, 'ant-input');
  });

  it('should have first item tag (Rando)', () => {
    ReactTestUtils.Simulate.change(input);
    ReactTestUtils.Simulate.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 });

    const tag = ReactTestUtils.findRenderedDOMComponentWithClass(screen, 'ant-tag');
    expect(tag.textContent).toBe('Randonnée pédestre');
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should have Trail tag', () => {
    input.value = 'tra';
    ReactTestUtils.Simulate.change(input);
    ReactTestUtils.Simulate.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 });

    const tag = ReactTestUtils.findRenderedDOMComponentWithClass(screen, 'ant-tag');
    expect(tag.textContent).toBe('Trail');
    ReactDOM.unmountComponentAtNode(div);
  });
});

