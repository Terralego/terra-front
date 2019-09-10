import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from '@blueprintjs/core';
import debounce from 'lodash.debounce';
import SearchInput from './SearchInput';

import AbstractMapControl from '../../../helpers/AbstractMapControl';
import translateMock from '../../../../../utils/translate';
import Tooltip from '../../../../../components/Tooltip';

import './styles.scss';

export class SearchControl extends AbstractMapControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-search';

  static propTypes = {
    /** Function called when user submit input. Takes query as parameter */
    onSearch: PropTypes.func,
    /** Function called when user click on a result item. Takes result object as parameter */
    onResultClick: PropTypes.func,
    /** Function used to render the search results. Default to bundled component */
    renderSearchResults: PropTypes.func,
    /** Function used to translate wording. Takes key and object of options as parameters */
    translate: PropTypes.func,
  }

  static defaultProps = {
    onSearch () {},
    onResultClick () {},
    translate: translateMock({
      'terralego.map.search_control.button_label': 'Search',
    }),
  }

  state = {
    visible: false,
    expanded: false,
    query: '',
    results: null,
    displayResults: false,
    selected: -1,
  };

  debouncedSearch = debounce(() => this.search(), 200);

  componentDidMount () {
    this.listener = ({ target }) => {
      const { container } = this.props;
      const { query } = this.state;

      if (container.contains(target)) return;

      this.toggleResultsDisplay(false);

      if (query) return;

      this.toggle(false);
    };
    global.addEventListener('click', this.listener);
  }

  componentWillUnmount () {
    global.removeEventListener('click', this.listener);
    this.isUnmount = true;
  }

  get flatResults () {
    const { results } = this.state;
    return Array.isArray(results) && results.reduce((all, { results: groupResults }) => [
      ...all,
      ...groupResults,
    ], []);
  }

  toggle = state => this.setState(({ visible }) => {
    if (visible && state !== true) {
      // SetTimeout because of css animation
      setTimeout(() => {
        if (this.isUnmount) return;
        this.setState({ visible: false });
      }, 500);
      return ({ expanded: false, results: null, selected: -1, query: '' });
    }
    if (!visible && state !== false) {
      setTimeout(() => {
        if (this.isUnmount) return;
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

  onKeyPress = ({ key }) => {
    const results = this.flatResults;

    this.toggleResultsDisplay(true);

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
      this.clickOnResult(selectedResult);
    }
  }

  toggleResultsDisplay = state => this.setState({ displayResults: state });

  clickOnResult = result => {
    const { onResultClick } = this.props;
    onResultClick({
      result,
      setQuery: query => this.setState({ query }),
    });
    this.toggleResultsDisplay(false);
  }

  async search () {
    const { onSearch } = this.props;
    const { query } = this.state;

    if (query.length < 3) {
      this.setState({ displayResults: false, results: null, selected: -1 });
      return;
    }

    this.setState({ loading: true });

    const results = await onSearch(query, this.map);

    if (this.isUnmount) return;
    this.setState({ displayResults: !!results, results, loading: false });
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
      translate,
    } = this.props;
    const { visible, expanded, query, displayResults, results, selected, loading } = this.state;

    return (
      <>
        <Tooltip
          content={translate('terralego.map.search_control.button_label')}
        >
          <button
            className="mapboxgl-ctrl-icon"
            type="button"
            aria-label={translate('terralego.map.search_control.button_label')}
            onClick={this.toggle}
          >
            <Icon icon="search" />
          </button>
        </Tooltip>
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
              onFocus={() => this.toggleResultsDisplay(true)}
              query={query}
              onKeyPress={this.onKeyPress}
              loading={loading}
            />
            {displayResults && Array.isArray(results) && (
              <SearchResults
                {...this.props}
                results={results}
                onClick={this.clickOnResult}
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
