import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import LayersTreeItem from './LayersTreeItem';

jest.mock('@blueprintjs/core', () => ({
  Button () {
    return <p>Button</p>;
  },
  Card ({ children }) {
    return children;
  },
  Switch () {
    return <p>Switch</p>;
  },
  Elevation: {
    TWO: 'two',
  },
  Tag () {
    return <p>Tag</p>;
  },
}));

jest.mock('@blueprintjs/select', () => ({
  Select () {
    return <p>BPSelect</p>;
  },
}));

jest.mock('@blueprintjs/datetime', () => ({
  DateRangeInput () {
    return <p>DateRangeInput</p>;
  },
}));

jest.mock('./OptionsLayer', () => function OptionsLayer () {
  return <p>OptionsLayer</p>;
});
jest.mock('./LayersTreeSubItemsList', () => function LayersTreeSubItemsList () {
  return <p>LayersTreeSubItemsList</p>;
});

jest.mock('./LayersTreeItemFilters', () => function LayersTreeItemFilters () {
  return <p>LayersTreeItemFilters</p>;
});

jest.mock('react-dom', () => ({
  createPortal: node => node,
}));

jest.mock('./FiltersPanel', () => function FiltersPanel () {
  return <p>FiltersPanel</p>;
});

it('should render correctly', () => {
  const tree = renderer.create((
    <>
      <LayersTreeItem
        layer={{
          label: 'foo',
        }}
        isActive
        opacity={1}
      />
      <LayersTreeItem
        layer={{
          label: 'bar',
        }}
        opacity={0.3}
      />
      <LayersTreeItem
        layer={{
          label: 'sublayers',
          sublayers: [{
            label: 'sublayer 1',
          }, {
            label: 'sublayer 2',
          }],
        }}
        isActive
        opacity={1}
      />
      <LayersTreeItem
        layer={{ label: 'sublayers', filters: { form: [] }, widgets: [{ component: 'foo' }] }}
        isActive
        isTableActive={false}
      />
      <LayersTreeItem
        layer={{ label: 'sublayers', displayed: false }}
      />
      <LayersTreeItem
        layer={{ label: 'sublayers', filters: { form: [] } }}
        isActive
        isTableActive
        total={42}
      />
    </>
  ));
  const a = tree.root.findAll(({ type }) => type === LayersTreeItem);
  a[5].instance.setState({ isFilterVisible: true });
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should change active state', () => {
  const layer = {};
  const setLayerState = jest.fn();
  const instance = new LayersTreeItem({
    layer,
    setLayerState,
  });
  instance.onActiveChange({
    target: {
      checked: true,
    },
  });
  expect(setLayerState).toHaveBeenCalledWith({
    layer,
    state: { active: true, table: false },
  });
  setLayerState.mockClear();

  instance.onActiveChange({
    target: {
      checked: false,
    },
  });
  expect(setLayerState).toHaveBeenCalledWith({
    layer,
    state: { active: false, table: false },
  });
});

it('should change opacity state', () => {
  const layer = {};
  const setLayerState = jest.fn();
  const instance = new LayersTreeItem({
    layer,
    setLayerState,
  });
  instance.onOpacityChange(42);
  expect(setLayerState).toHaveBeenCalledWith({
    layer,
    state: { opacity: 42 },
  });
});

it('should open options panel', () => {
  const instance = new LayersTreeItem({});
  instance.setState = jest.fn();

  instance.state = {
    isOptionsOpen: false,
  };
  instance.handleOptionPanel();
  expect(instance.setState).toHaveBeenCalledWith({
    isOptionsOpen: true,
  });
  instance.setState.mockClear();

  instance.state = {
    isOptionsOpen: true,
  };
  instance.handleOptionPanel();
  expect(instance.setState).toHaveBeenCalledWith({
    isOptionsOpen: false,
  });
});

it('should display options panel', () => {
  const wrapper = shallow((
    <LayersTreeItem
      layer={{
        label: 'foo',
      }}
      isActive
    />
  ));
  expect(wrapper.find('OptionsLayer').length).toBe(0);
  wrapper.setState({ isOptionsOpen: true });
  expect(wrapper.find('OptionsLayer').length).toBe(1);
});

it('should reset filter panel on unmount', () => {
  const instance = new LayersTreeItem();
  instance.resetFilterPanelListener = jest.fn();
  instance.componentWillUnmount();
  expect(instance.resetFilterPanelListener).toHaveBeenCalled();
});

it('should get filtered panel ref', () => {
  const instance = new LayersTreeItem();
  instance.resetFilterPanelListener = jest.fn();
  instance.setState = jest.fn();
  const refs = [{
    contains: () => true,
  }, {
    contains: () => false,
  }];
  jest.spyOn(document.body, 'addEventListener');
  instance.getFilterPanelRef(refs);
  expect(instance.resetFilterPanelListener).toHaveBeenCalled();
  expect(document.body.addEventListener).toHaveBeenCalledWith('mousedown', instance.clickListener);
  instance.clickListener({});
  expect(instance.setState).not.toHaveBeenCalled();

  instance.getFilterPanelRef([{ contains: () => false }]);
  instance.clickListener({ });
  expect(instance.setState).toHaveBeenCalledWith({ isFilterVisible: false });
});

it('should toggle filters', () => {
  const instance = new LayersTreeItem();
  instance.setState = jest.fn();
  instance.toggleFilters();
  expect(instance.setState).toHaveBeenCalledWith(expect.any(Function));
  const callback = instance.setState.mock.calls[0][0];
  expect(callback({ isFilterVisible: true })).toEqual({ isFilterVisible: false });
  expect(callback({ isFilterVisible: false })).toEqual({ isFilterVisible: true });
});

it('should toggle table', () => {
  const setLayerState = jest.fn();
  const layer = 'foo';
  const isTableActive = true;
  const instance = new LayersTreeItem({ setLayerState, layer, isTableActive });
  instance.toggleTable();
  expect(setLayerState).toHaveBeenCalledWith({ layer, state: { table: false } });
});

it('should toggle widgets', () => {
  const layer = 'foo';
  const widget = {};
  const setLayerState = jest.fn();
  const instance = new LayersTreeItem({ layer, setLayerState });

  instance.toggleWidgets(widget)();
  expect(setLayerState).toHaveBeenCalledWith({
    layer,
    state: {
      widgets: [widget],
    },
  });

  instance.props.widgets = [widget];
  instance.toggleWidgets(widget)();
  expect(setLayerState).toHaveBeenCalledWith({
    layer,
    state: {
      widgets: [],
    },
  });
});

it('should reset filters panel listener', () => {
  const instance = new LayersTreeItem();
  jest.spyOn(document.body, 'removeEventListener');
  instance.resetFilterPanelListener();
  expect(document.body.removeEventListener).not.toHaveBeenCalled();
  instance.clickListener = {};
  instance.resetFilterPanelListener();
  expect(document.body.removeEventListener).toHaveBeenCalledWith('mousedown', instance.clickListener);
});