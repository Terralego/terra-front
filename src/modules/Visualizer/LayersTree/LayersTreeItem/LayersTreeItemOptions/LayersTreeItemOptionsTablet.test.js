import React from 'react';
import renderer from 'react-test-renderer';
import LayersTreeProvider from '../../LayersTreeProvider';
import LayersTreeItemOptionsTablet from './LayersTreeItemOptionsTablet';

jest.mock('../LayerFetchValues', () => () => <p>LayerFetchValues</p>);
jest.mock('../FiltersPanel', () => (({ children }) => children));

jest.mock('../FiltersPanel', () => function FiltersPanel () {
  return <p>FiltersPanel</p>;
});

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
