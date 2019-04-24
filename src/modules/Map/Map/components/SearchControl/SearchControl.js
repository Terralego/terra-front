import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { Icon } from '@blueprintjs/core';
import debounce from 'lodash.debounce';

import SearchInput from './SearchInput';

import translateMock from '../../../../../utils/translate';

import './styles.scss';

export class SearchControl extends React.Component {
  state = {
    visible: false,
    expanded: false,
    query: '',
    results: null,
    selected: -1,
  };

  debouncedSearch = debounce(() => this.search(), 200);

  componentDidMount () {
    global.addEventListener('click', this.listener = e => {
      const { container } = this.props;
      const { query } = this.state;

      if (query || container.contains(e.target)) return;

      this.toggle(false);
    });
  }

  componentWillUnmount () {
    global.removeEventListener('click', this.listener);
  }

  onAdd (map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-search';
    ReactDOM.render(<SearchControl container={this.container} {...this.props} />, this.container);
    return this.container;
  }

  onRemove () {
    this.container.parentNode.removeChild(this.container);
    delete this.map;
  }

  get flatResults () {
    const { results } = this.state;
    return results && results.reduce((all, { results: groupResults }) => [
      ...all,
      ...groupResults,
    ], []);
  }

  toggle = state => this.setState(({ visible }) => {
    if (visible && state !== true) {
      setTimeout(() => this.setState({ visible: false }), 500);
      return ({ expanded: false, results: null, selected: -1, query: '' });
    }
    if (!visible && state !== false) {
      setTimeout(() => {
        const { container } = this.props;
        this.setState({ expanded: true });
        container.querySelector('input').focus();
      });
      return ({ visible: true });
    }
    return null;
  });

  close = () => this.toggle(false);

  onChange = ({ target: { value: query } }) => {
    this.setState({ query });
    this.debouncedSearch();
  }

  search = async () => {
    const { onSearch } = this.props;
    const { query } = this.state;

    if (query.length < 3) {
      this.setState({ results: null, selected: -1 });
      return;
    }

    const results = await onSearch(query, this.map);

    this.setState({ results: results || true });
  }

  onKeyPress = ({ key }) => {
    const results = this.flatResults;
    if (!results) return;

    if (key === 'Escape') {
      this.toggle(false);
    }
    if (key === 'ArrowDown') {
      this.selectResultItem(+1);
    }
    if (key === 'ArrowUp') {
      this.selectResultItem(-1);
    }
    if (key === 'Enter') {
      const { selected } = this.state;
      const selectedResult = results[selected];
      if (!selectedResult) return;
      const { onResultClick } = this.props;
      onResultClick(selectedResult);
    }
  }

  selectResultItem (dir) {
    this.setState(({ selected }) => {
      const max = this.flatResults.length;

      if (selected + dir < 0) {
        return { selected: max - 1 };
      }

      if (selected + dir >= max) {
        return { selected: 0 };
      }

      return { selected: selected + dir };
    });
  }

  render () {
    const {
      renderSearchResults: SearchResults,
      onResultClick,
      translate = translateMock,
    } = this.props;
    const { visible, expanded, query, results, selected } = this.state;

    return (
      <>
        <button
          className="mapboxgl-ctrl-icon"
          type="button"
          title={translate('terralego.map.search_control.button_label')}
          aria-label={translate('terralego.map.search_control.button_label')}
          onClick={this.toggle}
        >
          <Icon icon="search" />
        </button>
        {visible && (
          <div className={classnames({
            'mapboxgl-ctrl-search__input': true,
            'mapboxgl-ctrl-search__input--expanded': expanded,
          })}
          >
            <SearchInput
              {...this.props}
              onChange={this.onChange}
              onClose={this.close}
              query={query}
              onKeyPress={this.onKeyPress}
            />
            {results && (
              <SearchResults
                {...this.props}
                results={results}
                onClick={onResultClick}
                selected={this.flatResults[selected]}
              />
            )}
          </div>
        )}
      </>
    );
  }
}

export default SearchControl;
