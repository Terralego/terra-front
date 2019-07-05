import React from 'react';
import renderer from 'react-test-renderer';
import LayersTreeProvider from '../../LayersTreeProvider';
import LayersTreeItemOptionsTablet from './LayersTreeItemOptionsTablet';

jest.mock('../LayerFetchValues', () => () => <p>LayerFetchValues</p>);
jest.mock('../FiltersPanel', () => (({ children }) => children));

it('should render correctly', () => {
  const tree = renderer.create((
    <LayersTreeProvider>
      <LayersTreeItemOptionsTablet />
      <LayersTreeItemOptionsTablet
        isFilterVisible
        form={[]}
      />
    </LayersTreeProvider>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
