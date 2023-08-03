import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import LayersTreeItemOptionsDesktop from './LayersTreeItemOptionsDesktop';

jest.mock('../LayerFetchValues', () => function LayerFetchValues () {
  return <p>LayerFetchValues</p>;
});

jest.mock('../FiltersPanel', () => function FiltersPanel () {
  return <p>FiltersPanel</p>;
});

jest.mock('../LocateButton', () => () => <button type="button">Extent this layer</button>);


it('should render default options', () => {
  const tree = renderer.create((
    <LayersTreeItemOptionsDesktop />));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render with properties', () => {
  const tree = renderer.create((
    <LayersTreeItemOptionsDesktop
      displayTableButton
      form={[]}
      widgets={[{ component: 'foo' }]}
      isWidgetActive={jest.fn(() => true)}
      toggleWidgets={jest.fn(() => true)}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render no tooltip if empty widget empty', () => {
  const tree = renderer.create((
    <LayersTreeItemOptionsDesktop
      widgets={[]}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should open widget', () => {
  const wrapper = shallow((
    <LayersTreeItemOptionsDesktop
      displayTableButton
      form={[]}
      widgets={[{ component: 'foo' }]}
      isWidgetActive={jest.fn(() => false)}
      toggleWidgets={jest.fn(() => true)}
    />
  ));
  expect(wrapper.find('.widgets').props().content).toBe('open widget');
});

it('should close table', () => {
  const wrapper = shallow((
    <LayersTreeItemOptionsDesktop
      displayTableButton
      isTableActive
    />
  ));
  expect(wrapper.find('.table').props().content).toBe('close table');
  expect(wrapper.find('.table').dive().find('.layerstree-node-content__options__button').props().alt).toBe('close table');
});

it('should close form', () => {
  const wrapper = shallow((
    <LayersTreeItemOptionsDesktop
      form={[]}
      isFilterVisible
    />
  ));
  expect(wrapper.find('.filters').props().content).toBe('close filters');
});

it('should close options', () => {
  const wrapper = shallow((
    <LayersTreeItemOptionsDesktop
      isOptionsOpen
    />
  ));
  expect(wrapper.find('.options').props().content).toBe('Changer l\'opacité de la couche');
  expect(wrapper.find('.options').dive().find('.layerstree-node-content__options__button').props().alt).toBe('Opacité');
});
