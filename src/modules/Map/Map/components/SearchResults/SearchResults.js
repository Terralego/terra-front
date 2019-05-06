import React from 'react';
import classnames from 'classnames';
import { Card, Divider } from '@blueprintjs/core';

import translateMock from '../../../../../utils/translate';

export const SearchResults = ({
  results = [],
  onClick,
  maxResults = 5,
  translate = translateMock,
  selected = -1,
}) => (
  <Card className="search-results">
    <p className="search-results__title">
      {translate('terralego.map.search_results.title')}
    </p>
    {results.map(({ group, total, results: resultsItems }, index) => (
      <div
        key={group}
        className="search-results__group"
      >
        <p className="search-results__group-title">
          {group}
          {total && (
            <>
              &nbsp;
              <em>
                {translate('terralego.map.search_results.group_total', { count: total })}
              </em>
            </>
          )}
        </p>
        {resultsItems.length
          ? (
            <ul className="search-results__list">
              {resultsItems.slice(0, 5).map(item => (
                <li
                  key={item.label}
                  className={classnames({
                    'search-results__item': true,
                    'search-results__item--active': true,
                    'search-results__item--selected': selected === item,
                  })}
                >
                  <button
                    type="button"
                    onClick={() => onClick(item)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {resultsItems.length > maxResults && (
                <li className="search-results__item search-results__item--more">…</li>
              )}
            </ul>
          ) : (
            <p className="search-results__item">
              {translate('terralego.map.search_results.no_result')}
            </p>
          )}
        {!!results[index + 1] && <Divider />}
      </div>
    ))}
  </Card>
);


export default SearchResults;
