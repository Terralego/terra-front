import React from 'react';
import renderer from 'react-test-renderer';
import FiltersPanel from './FiltersPanel';

jest.mock('react-dom', () => ({
  createPortal: node => node,
}));

jest.mock('./FiltersPanelContent', () => function FiltersPanelContent () {
  return <p>FiltersPanelContent</p>;
});

it('should render correctly', () => {
  const tree = renderer.create((
    <FiltersPanel />
  )).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should get position', () => {
  const instance = new FiltersPanel();

  expect(instance.getPosition()).toEqual({});

  instance.containerRef.current = {
    getBoundingClientRect: () => ({
      top: 1,
      left: 2,
      width: 3,
      height: 4,
    }),
  };
  expect(instance.getPosition()).toEqual({
    top: 1,
    left: 2,
    width: 3,
    height: 4,
  });
});

it('should get panel ref', () => {
  const instance = new FiltersPanel();
  const ref = {};
  instance.getPanelRef(ref);
  expect(instance.panelContentRef).toEqual({
    current: ref,
  });
});

it('should handle change', () => {
  const setLayerState = jest.fn();
  const instance = new FiltersPanel({ setLayerState, layer: 'foo' });
  const filters = {};
  instance.handleChange(filters);
  expect(setLayerState).toHaveBeenCalledWith({
    layer: 'foo',
    state: {
      filters,
      total: null,
    },
  });
});
