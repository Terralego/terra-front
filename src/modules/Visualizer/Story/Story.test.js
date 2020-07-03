import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { toggleLayerVisibility } from '../../Map/services/mapUtils';

import Story from './Story';

jest.mock('../../Map/services/mapUtils', () => ({
  toggleLayerVisibility: jest.fn(),
}));

const story = {
  beforeEach: [{
    layers: [
      'foo-*',
      'bar',
    ],
    active: false,
  }],
  slides: [{
    title: 'Slide 1',
    content: `
  <p>
    Content 1
  </p>
`,
    layouts: [{
      layers: ['foo-1a', 'foo-1b'],
      active: true,
    }],
  }, {
    title: 'Slide 2',
    content: `
<p>
  Content 2
</p>
`,
    layouts: [{
      layers: ['foo-1a', 'foo-1b'],
      active: true,
    }],
  }, {
    title: 'Slide 3',
    content: `
<p>
  Content 3
</p>
`,
    layouts: [{
      layers: ['foo-2'],
      active: true,
    }],
    legends: [{
      title: 'Legend 1',
      items: [
        { label: 'a', color: '#ff8c00' },
        { label: 'b', color: '#965096' },
        { label: 'c', color: '#ff78a0' },
        { label: 'd', color: '#003c82' },
        { label: 'e', color: '#f5000a' },
        { label: 'f', color: '#c8be00' },
        { label: 'g', color: '#90ff77' },
        { label: 'h', color: '#007dff' },
        { label: 'i', color: '#1e6414' },
      ],
    }],
  }, {
    title: 'Slide 4',
    content: `
<p>
  Content 4
</p>
    `,
    layouts: [{
      layers: ['foo-3'],
      active: true,
    }],
    legends: [{
      title: 'Legend 2',
      items: [
        { label: '1', color: '#b91a1c' },
        { label: '2', color: '#b3de69' },
        { label: '3', color: '#1f78b4' },
        { label: '4', color: '#a6a5ae' },
        { label: '5', color: '#ec7c30' },
        { label: '6', color: '#fedb2a' },
        { label: '7', color: '#8fa9db' },
        { label: '8', color: '#9e480d' },
      ],
    }],
  }, {
    title: 'Slide 5',
    content: `
<p>
  Content 5
</p>
`,
    layouts: [{
      layers: ['foo-4'],
      active: true,
    }],
    legends: [{
      title: 'Legend 3',
      items: [
        { label: 'a', color: '#fcbba1', shape: 'circle', radius: 5 },
        { label: 'aa', color: '#fc9272', shape: 'circle', radius: 10 },
        { label: 'aaa', color: '#fb6a4a', shape: 'circle', radius: 15 },
        { label: 'aaaa', color: '#ef3b2c', shape: 'circle', radius: 20 },
        { label: 'aaaaa', color: '#cb181d', shape: 'circle', radius: 25 },
        { label: 'aaaaaa', color: '#99000d', shape: 'circle', radius: 30 },
      ],
    }],
  }, {
    title: 'Slide 6',
    content: `
<p>
  Content 6
</p>
`,
    layouts: [{
      layers: ['bar'],
      active: true,
    }],
  }],
};

it('should render', () => {
  const { asFragment } = render(
    <Story story={story} />,
  );
  expect(asFragment()).toMatchSnapshot();
});

it('should call callback on mount', () => {
  const setLegends = jest.fn();
  render(
    <Story
      setLegends={setLegends}
      story={story}
      map={{
        getStyle: jest.fn(() => ({ layers: [{ id: 'foo-1a' }] })),
        setLayoutProperty: jest.fn(),
      }}
    />,
  );
  expect(toggleLayerVisibility).toHaveBeenCalled();
  expect(setLegends).toHaveBeenCalled();
});

it('should set nextStep', () => {
  const { container, getByText } = render(
    <Story story={story} />,
  );
  const nextButton = container.querySelector('.bp3-intent-primary');
  fireEvent.click(nextButton);
  const title = getByText('Slide 2');
  expect(title).toBeTruthy();
});

it('should set nextStep at the last slide and loop to the first step', () => {
  const { container, getByText } = render(
    <Story story={story} />,
  );
  const nextButton = container.querySelector('.bp3-intent-primary');
  story.slides.forEach(() => {
    fireEvent.click(nextButton);
  });
  const title = getByText('Slide 1');
  expect(title).toBeTruthy();
});

it('should not have prevStep button in the first step', () => {
  const { container } = render(
    <Story story={story} />,
  );
  const nextButton = container.querySelector('.bp3-intent-primary');
  story.slides.forEach((_, index) => {
    const buttons = container.querySelectorAll('.bp3-button');
    expect(buttons.length).toBe((index === 0) ? 1 : 2);
    fireEvent.click(nextButton);
  });
});

it('should set prevStep', () => {
  const { container } = render(
    <Story story={story} />,
  );
  const nextButton = container.querySelector('.bp3-intent-primary');
  const title = container.querySelector('h2');
  fireEvent.click(nextButton);
  expect(title.textContent).toBe('Slide 2');
  const prevButton = container.querySelector('.bp3-button');
  fireEvent.click(prevButton);
  expect(title.textContent).toBe('Slide 1');
});

it('should not display buttons if there is only one step', () => {
  const { container } = render(
    <Story story={{ ...story, slides: [story.slides[0]] }} />,
  );
  const buttonContainer = container.querySelector('.storytelling__buttons');
  expect(buttonContainer).toBe(null);
});
