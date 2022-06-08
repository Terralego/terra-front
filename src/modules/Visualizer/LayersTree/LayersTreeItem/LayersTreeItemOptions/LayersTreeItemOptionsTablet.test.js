import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import LayersTreeProvider from '../../LayersTreeProvider';
import LayersTreeItemOptionsTablet from './LayersTreeItemOptionsTablet';

jest.mock('../LayerFetchValues', () => () => <p>LayerFetchValues</p>);
jest.mock('../FiltersPanel', () => (({ children }) => children));

jest.mock('../FiltersPanel', () => function FiltersPanel () {
  return <p>FiltersPanel</p>;
});

jest.mock('../LocateButton', () => () => <button type="button">Extent this layer</button>);

it('should render correctly with widget', () => {
  const tree = renderer.create((
    <LayersTreeProvider>
      <LayersTreeItemOptionsTablet
        isFilterVisible
        form={[]}
      />
      <LayersTreeItemOptionsTablet
        isFilterVisible
        form={[]}
        isWidgetActive={() => true}
        isOptionsOpen={() => true}
        widgets={[{ component: 'foo' }]}
        toggleWidgets={() => null}
      />
    </LayersTreeProvider>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should open widget', () => {
  const wrapper = shallow((
    <LayersTreeItemOptionsTablet
      displayTableButton
      form={[]}
      widgets={[{ component: 'foo' }]}
      isWidgetActive={() => false}
      toggleWidgets={() => true}
    />
  ));
  expect(wrapper.find('.btn-widget').props().alt).toBe('open widget');
});

it('should close widget', () => {
  const wrapper = shallow((
    <LayersTreeItemOptionsTablet
      displayTableButton
      form={[]}
      widgets={[{ component: 'foo' }]}
      isWidgetActive={() => true}
      toggleWidgets={() => true}
    />
  ));
  expect(wrapper.find('.btn-widget').props().alt).toBe('close widget');
});

it('should close table', () => {
  const wrapper = shallow((
    <LayersTreeItemOptionsTablet
      displayTableButton
      isTableActive
    />
  ));
  expect(wrapper.find('.btn-table').props().alt).toBe('close table');
});
