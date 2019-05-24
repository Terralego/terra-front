import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import SearchControl from './SearchControl';

jest.mock('lodash.debounce', () => fn => () => fn());
jest.useFakeTimers();

it('should render', () => {
  const tree = renderer.create(
    <SearchControl
      renderSearchResults={props => <div {...props}>SearchResults</div>}
    />,
  );
  tree.getInstance().setState({
    visible: true,
    displayResults: true,
    results: [{
      group: 'foo',
      results: [{
        label: 'foo1',
      }, {
        label: 'foo2',
      }],
    }, {
      group: 'bar',
      results: [],
    }],
  });
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should add listener on mount', () => {
  jest.spyOn(global, 'addEventListener');
  const wrapper = shallow(<SearchControl />);
  const instance = wrapper.instance();
  expect(global.addEventListener).toHaveBeenCalledWith('click', instance.listener);
});

it('should close control on click', () => {
  jest.spyOn(global, 'addEventListener');
  const wrapper = shallow(<SearchControl />);
  const instance = wrapper.instance();
  instance.toggle = jest.fn();
  instance.toggleResultsDisplay = jest.fn();

  instance.props = {
    container: {
      contains: () => true,
    },
  };
  instance.listener({ target: null });
  expect(instance.toggle).not.toHaveBeenCalled();
  instance.toggle.mockClear();

  instance.props = {
    container: {
      contains: () => false,
    },
  };
  instance.state = {
    query: 'abc',
  };
  instance.listener({ target: null });
  expect(instance.toggle).not.toHaveBeenCalled();
  instance.toggle.mockClear();

  instance.props = {
    container: {
      contains: () => false,
    },
  };
  instance.state = {};
  instance.listener({ target: null });
  expect(instance.toggle).toHaveBeenCalled();

  instance.props = {
    container: {
      contains: () => true,
    },
  };
  instance.state = { query: 'abc', displayResults: true };
  instance.listener({ target: null });
  expect(instance.toggleResultsDisplay).toHaveBeenCalledWith(false);
});

it('should remove listener on unmount', () => {
  const instance = new SearchControl();
  instance.listener = {};
  jest.spyOn(global, 'removeEventListener');
  instance.componentWillUnmount();
  expect(global.removeEventListener).toHaveBeenCalledWith('click', instance.listener);
});

it('should debounce search', () => {
  const instance = new SearchControl();
  instance.search = jest.fn();
  instance.debouncedSearch();
  expect(instance.search).toHaveBeenCalled();
});

it('should get flat results', () => {
  const results = [{
    group: 'foo',
    results: [{
      label: 'foo1',
    }, {
      label: 'foo2',
    }],
  }, {
    group: 'bar',
    results: [{
      label: 'bar1',
    }, {
      label: 'bar2',
    }],
  }];
  const instance = new SearchControl({ });
  instance.state = {
    results,
  };
  expect(instance.flatResults).toEqual([{
    label: 'foo1',
  }, {
    label: 'foo2',
  }, {
    label: 'bar1',
  }, {
    label: 'bar2',
  }]);
});

it('should toggle results', () => {
  const instance = new SearchControl();
  let stateCallback;
  instance.setState = jest.fn(fn => { stateCallback = fn; });
  instance.toggle();
  expect(instance.setState).toHaveBeenCalled();

  instance.setState = jest.fn();
  expect(stateCallback({ visible: true })).toEqual({ expanded: false, results: null, selected: -1, query: '' });
  jest.runAllTimers();
  expect(instance.setState).toHaveBeenCalledWith({ visible: false });

  instance.setState = jest.fn();
  const inputMock = {
    focus: jest.fn(),
  };
  instance.props = {
    container: {
      querySelector: jest.fn(() => inputMock),
    },
  };
  expect(stateCallback({ visible: false })).toEqual({ visible: true });
  jest.runAllTimers();
  expect(instance.setState).toHaveBeenCalledWith({ expanded: true });
  expect(instance.props.container.querySelector).toHaveBeenCalledWith('input');
  expect(inputMock.focus).toHaveBeenCalled();
});

it('should not toggle if unmount', () => {
  const instance = new SearchControl();
  let stateCallback;
  instance.setState = jest.fn(fn => { stateCallback = fn; });

  instance.toggle();
  instance.setState.mockClear();
  stateCallback({ visible: true });
  instance.isUnmount = true;
  jest.runAllTimers();
  expect(instance.setState).not.toHaveBeenCalled();

  stateCallback({ visible: false });
  instance.isUnmount = true;
  jest.runAllTimers();
  expect(instance.setState).not.toHaveBeenCalled();
});

it('should force toggle results', () => {
  const instance = new SearchControl();
  let stateCallback;
  instance.setState = jest.fn(fn => { stateCallback = fn; });

  instance.toggle(false);
  expect(stateCallback({ visible: false })).toEqual(null);
  expect(stateCallback({ visible: true })).toEqual({ expanded: false, results: null, selected: -1, query: '' });

  instance.toggle(true);
  expect(stateCallback({ visible: false })).toEqual({ visible: true });
  expect(stateCallback({ visible: true })).toEqual(null);
});

it('should close results', () => {
  const instance = new SearchControl();
  instance.toggle = jest.fn();
  instance.close();
  expect(instance.toggle).toHaveBeenCalledWith(false);
});

it('should handle input value change', () => {
  const instance = new SearchControl();
  instance.setState = jest.fn();
  instance.debouncedSearch = jest.fn();
  instance.onChange({ target: { value: 'foo' } });
  expect(instance.setState).toHaveBeenCalledWith({ query: 'foo' });
  expect(instance.debouncedSearch).toHaveBeenCalled();
});

it('should handle key press', () => {
  const onResultClick = jest.fn();
  const instance = new SearchControl({ onResultClick });
  const selected = {
    label: 'foo',
  };
  instance.state = {
    results: [{
      results: [selected],
    }],
    selected: 0,
  };
  instance.setState = jest.fn();
  instance.toggle = jest.fn();
  instance.selectResultItem = jest.fn();

  instance.onKeyPress({ key: 'a' });
  expect(onResultClick).not.toHaveBeenCalled();
  expect(instance.toggle).not.toHaveBeenCalled();
  expect(instance.selectResultItem).not.toHaveBeenCalled();

  instance.onKeyPress({ key: 'Escape' });
  expect(onResultClick).not.toHaveBeenCalled();
  expect(instance.toggle).toHaveBeenCalledWith(false);
  expect(instance.selectResultItem).not.toHaveBeenCalled();
  instance.toggle.mockClear();

  instance.onKeyPress({ key: 'ArrowDown' });
  expect(onResultClick).not.toHaveBeenCalled();
  expect(instance.toggle).not.toHaveBeenCalled();
  expect(instance.selectResultItem).toHaveBeenCalledWith(1);
  instance.selectResultItem.mockClear();

  instance.onKeyPress({ key: 'ArrowUp' });
  expect(onResultClick).not.toHaveBeenCalled();
  expect(instance.toggle).not.toHaveBeenCalled();
  expect(instance.selectResultItem).toHaveBeenCalledWith(-1);
  instance.selectResultItem.mockClear();

  instance.onKeyPress({ key: 'Enter' });
  expect(onResultClick).toHaveBeenCalledWith({
    result: selected,
    setQuery: expect.any(Function),
  });
  expect(instance.toggle).not.toHaveBeenCalled();
  expect(instance.selectResultItem).not.toHaveBeenCalled();
  onResultClick.mockClear();

  instance.state.results = [{
    results: [],
  }];

  instance.onKeyPress({ key: 'Enter' });
  expect(onResultClick).not.toHaveBeenCalled();
  expect(instance.toggle).not.toHaveBeenCalled();
  expect(instance.selectResultItem).not.toHaveBeenCalled();

  instance.state.results = null;

  instance.onKeyPress({ key: 'Enter' });
  expect(onResultClick).not.toHaveBeenCalled();
  expect(instance.toggle).not.toHaveBeenCalled();
  expect(instance.selectResultItem).not.toHaveBeenCalled();
});

it('should search', async () => {
  const results = [];
  const onSearch = jest.fn(() => results);
  const instance = new SearchControl({ onSearch });
  instance.map = {};
  instance.setState = jest.fn();
  instance.state = {};

  instance.state.query = 'ab';
  await instance.search();
  expect(instance.setState).toHaveBeenCalledWith({
    displayResults: false, results: null, selected: -1,
  });

  instance.state.query = 'abc';
  const searching = instance.search();
  expect(instance.setState).toHaveBeenCalledWith({ loading: true });
  instance.setState.mockClear();

  await searching;

  expect(onSearch).toHaveBeenCalledWith('abc', instance.map);
  expect(instance.setState).toHaveBeenCalledWith({
    displayResults: true,
    results,
    loading: false,
  });

  instance.setState.mockClear();
  instance.state.query = 'abc';
  instance.props.onSearch = jest.fn();
  await instance.search();
  expect(onSearch).toHaveBeenCalledWith('abc', instance.map);
  expect(instance.setState).toHaveBeenCalledWith({
    displayResults: false,
    results: undefined,
    loading: false,
  });
});

it('should not search if unmount', async () => {
  const results = [];
  const onSearch = jest.fn(() => results);
  const instance = new SearchControl({ onSearch });
  instance.state.query = 'abc';
  instance.setState = jest.fn();
  const search = instance.search();
  instance.isUnmount = true;
  instance.setState.mockClear();
  await search;
  expect(instance.setState).not.toHaveBeenCalled();
});

it('should select result item', () => {
  const instance = new SearchControl();
  instance.state = {
    results: [{
      results: [{
        label: '1',
      }, {
        label: '2',
      }],
    }, {
      results: [{
        label: '3',
      }, {
        label: '4',
      }],
    }],
  };
  let stateCallback;
  instance.setState = jest.fn(fn => { stateCallback = fn; });
  instance.selectResultItem(1);
  expect(stateCallback({ selected: -1 })).toEqual({ selected: 0 });
  expect(stateCallback({ selected: 0 })).toEqual({ selected: 1 });
  expect(stateCallback({ selected: 1 })).toEqual({ selected: 2 });
  expect(stateCallback({ selected: 2 })).toEqual({ selected: 3 });
  expect(stateCallback({ selected: 3 })).toEqual({ selected: 0 });

  instance.selectResultItem(-1);
  expect(stateCallback({ selected: -1 })).toEqual({ selected: 3 });
  expect(stateCallback({ selected: 3 })).toEqual({ selected: 2 });
  expect(stateCallback({ selected: 2 })).toEqual({ selected: 1 });
  expect(stateCallback({ selected: 1 })).toEqual({ selected: 0 });
  expect(stateCallback({ selected: 0 })).toEqual({ selected: 3 });
});

it('should click on result', () => {
  let expectedSetQuery;
  const onResultClick = jest.fn(({ setQuery }) => {
    expectedSetQuery = setQuery;
  });
  const instance = new SearchControl({ onResultClick });
  instance.setState = jest.fn();
  const result = {};
  instance.clickOnResult(result);
  expect(onResultClick).toHaveBeenCalledWith({
    result,
    setQuery: expect.any(Function),
  });
  expectedSetQuery('foo');
  expect(instance.setState).toHaveBeenCalledWith({ query: 'foo' });
});

it('should display results on focus', () => {
  const wrapper = shallow(<SearchControl />);
  const instance = wrapper.instance();
  instance.setState({ visible: true });
  instance.toggleResultsDisplay = jest.fn();
  wrapper.find('SearchInput').props().onFocus();
  expect(instance.toggleResultsDisplay).toHaveBeenCalled();
});
