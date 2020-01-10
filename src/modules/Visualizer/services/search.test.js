import elasticsearch from 'elasticsearch';
import search, {
  buildQuery,
  getExtent,
  getSearchParamFromProperty,
  MAX_SIZE,
  Search,
  SEARCHES_QUEUE,
} from './search';

jest.mock('elasticsearch', () => {
  const mockedClient = {
    search: jest.fn(),
    msearch: jest.fn(),
  };
  function Client () {
    return mockedClient;
  }
  return { Client };
});
jest.mock('lodash.debounce', () => fn => () => fn());

beforeEach(() => SEARCHES_QUEUE.clear());

it('should get extent', () => {
  const map = {
    getBounds () {
      return {
        toArray () {
          return [[1, 2], [3, 4]];
        },
      };
    },
  };
  expect(getExtent(map)).toEqual([[1, 4], [3, 2]]);
});

it('should get extent with padding', () => {
  const map = {
    unproject: jest.fn(([left, top]) => ({
      toArray: () => [left, top],
    })),
  };
  const extent = getExtent(map, { top: 42, left: 123, width: 100, height: 50 });

  expect(extent).toEqual([[123, 42], [223, 92]]);
  expect(map.unproject).toHaveBeenCalledWith([123, 42]);
  expect(map.unproject).toHaveBeenCalledWith([223, 92]);
});

it('should get search param from property', () => {
  const properties = {
    freetext: 'foo',
    fromvalues: 'bar',
    range: [0, 100],
  };
  const form = [{
    property: 'freetext',
  }, {
    property: 'fromvalues',
    values: ['foo', 'bar'],
  }, {
    property: 'range',
    type: 'range',
    min: 0,
    max: 100,
  }];
  expect(getSearchParamFromProperty(properties, form, 'freetext')).toEqual({
    freetext: 'foo',
  });
  expect(getSearchParamFromProperty(properties, form, 'fromvalues')).toEqual({
    'fromvalues.keyword': {
      type: 'term',
      value: 'bar',
    },
  });
  expect(getSearchParamFromProperty(properties, form, 'range')).toEqual({
    range: {
      type: 'range',
      value: { min: 0, max: 100 },
    },
  });
  expect(getSearchParamFromProperty(properties, form, 'nope')).toEqual({});
});

it('should build query', () => {
  expect(buildQuery({
    query: 'foo',
    boundingBox: [[1, 4], [3, 2]],
    size: 42,
    properties: {
      foo: 'FOO',
      bar: 'BAR',
    },
    include: ['foo', 'bar'],
  })).toEqual({
    _source: {
      include: ['foo', 'bar'],
    },
    query: {
      bool: {
        filter: {
          bool: {
            must: [{
              bool: {
                should: [{
                  match: {
                    foo: 'FOO',
                  },
                }, {
                  wildcard: {
                    foo: '*FOO*',
                  },
                }],
              },
            }, {
              bool: {
                should: [{
                  match: {
                    bar: 'BAR',
                  },
                }, {
                  wildcard: {
                    bar: '*BAR*',
                  },
                }],
              },
            }, {
              geo_shape: {
                geom: {
                  shape: {
                    coordinates: [[1, 4], [3, 2]],
                    type: 'envelope',
                  },
                },
              },
            }],
          },
        },
        must: {
          query_string: {
            query: '*foo*',
          },
        },
      },
    },
    size: 42,
  });
});

it('should build elastic search query with a literal query', () => {
  expect(buildQuery({
    query: 'foo',
  })).toEqual({
    query: {
      query_string: {
        query: '*foo*',
      },
    },
    size: MAX_SIZE,
  });
});

it('should build query with properties', () => {
  expect(buildQuery({
    size: 42,
    properties: {
      foo: 'FOO',
      bar: {
        value: 'BAR',
        type: 'term',
      },
    },
  })).toEqual({
    query: {
      bool: {
        filter: {
          bool: {
            must: [{
              bool: {
                should: [{
                  match: {
                    foo: 'FOO',
                  },
                }, {
                  wildcard: {
                    foo: '*FOO*',
                  },
                }],
              },
            }, {
              term: {
                bar: 'BAR',
              },
            }],
          },
        },
      },
    },
    size: 42,
  });
});

it('should build query with aggregations', () => {
  expect(buildQuery({
    size: 42,
    aggregations: [{
      field: 'foo',
      name: 'foo',
      options: {
        size: 100,
      },
    }],
  })).toEqual({
    aggs: {
      foo: {
        terms: {
          field: 'foo',
          size: 100,
        },
      },
    },
    size: 42,
  });
});

it('should build query with include', () => {
  expect(buildQuery({
    size: 42,
    include: ['foo'],
  })).toEqual({
    size: 42,
    _source: {
      include: ['foo'],
    },
  });

  expect(buildQuery({
    size: 42,
    include: [],
  })).toEqual({
    size: 42,
    _source: false,
  });
});

it('should build query with exclude', () => {
  expect(buildQuery({
    size: 42,
    exclude: ['foo'],
  })).toEqual({
    size: 42,
    _source: {
      exclude: ['foo'],
    },
  });
});

it('should build query with include and exclude', () => {
  expect(buildQuery({
    size: 42,
    include: ['foo'],
    exclude: ['bar'],
  })).toEqual({
    size: 42,
    _source: {
      include: ['foo'],
      exclude: ['bar'],
    },
  });
});

it('should build query with range properties', () => {
  expect(buildQuery({
    size: 42,
    properties: [{
      type: 'range',
      value: { min: 1, max: 2 },
    }],
  })).toEqual({
    size: 42,
    query: {
      bool: {
        filter: {
          range: {
            0: {
              gte: 1,
              lte: 2,
            },
          },
        },
      },
    },
  });
});

it('should build query with multiselect properties', () => {
  expect(buildQuery({
    size: 42,
    properties: [
      {
        type: 'term', value: ['PAYS DE LA LOIRE', 'BRETAGNE'],
      }],
  })).toEqual({
    size: 42,
    query: {
      bool: {
        filter: {
          bool: {
            should: [
              { terms: { 0: ['PAYS DE LA LOIRE', 'BRETAGNE'] } },
            ],
          },
        },
      },
    },
  });
});

it('should build query with invalid properties', () => {
  expect(buildQuery({
    size: 42,
    properties: [{
      foo: {
        bar: 'foobar',
      },
    }],
  })).toEqual({
    size: 42,
  });
});

it('should batch a query', () => {
  const searchService = new Search();
  searchService.batchSearch = jest.fn();
  searchService.search({
    query: 'foo',
  });
  expect(SEARCHES_QUEUE.size).toBe(1);
  expect(searchService.batchSearch).toHaveBeenCalled();
});

it('should search empty query', () => {
  const searchService = new Search();
  searchService.batchSearch = jest.fn();
  searchService.search();
  expect(SEARCHES_QUEUE.size).toBe(1);
  expect(searchService.batchSearch).toHaveBeenCalled();
});

it('should search handling indexes', async () => {
  const body = { query: { query_string: { query: '*foo*' } }, size: MAX_SIZE };
  const searchService = new Search();
  searchService.client.msearch = jest.fn();
  searchService.search({
    query: 'foo',
  });
  expect(searchService.client.msearch).toHaveBeenCalledWith({
    body: [
      { },
      body,
    ],
  });

  searchService.search({
    query: 'foo',
    index: 'bar',
  });
  expect(searchService.client.msearch).toHaveBeenCalledWith({
    body: [
      { index: 'bar' },
      body,
    ],
  });
});

it('should batch many queries', () => {
  const searchService = new Search();
  searchService.batchSearch = jest.fn();
  searchService.search({
    query: 'foo',
  });
  searchService.search({
    query: 'bar',
  });
  expect(SEARCHES_QUEUE.size).toBe(2);
  expect(searchService.batchSearch).toHaveBeenCalled();
});

it('should process batched queries', async () => {
  const searchService = new Search();
  const resolve1 = jest.fn();
  const body1 = {
    query: {
      query_string: {
        query: '*foo*',
      },
    },
    size: MAX_SIZE,
  };
  const response1 = { foo: 'bar' };
  const resolve2 = jest.fn();
  const body2 = {
    query: {
      query_string: {
        query: '*bar*',
      },
    },
    size: MAX_SIZE,
  };
  const response2 = { bar: 'foo' };
  searchService.client.msearch = jest.fn(() => ({
    responses: [response1, response2],
  }));
  SEARCHES_QUEUE.add({
    body: body1,
    resolve: resolve1,
  });
  SEARCHES_QUEUE.add({
    body: body2,
    resolve: resolve2,
  });
  searchService.batchSearch();
  await true;
  expect(SEARCHES_QUEUE.size).toBe(0);
  expect(searchService.client.msearch).toHaveBeenCalledWith({
    body: [
      {},
      body1,
      {},
      body2,
    ],
  });
  expect(resolve1).toHaveBeenCalledWith(response1);
  expect(resolve2).toHaveBeenCalledWith(response2);
});

it('should search many queries', () => {
  const client = elasticsearch.Client();
  search.msearch([{
    query: 'foo',
  }, {
    query: 'bar',
    index: 'foobar',
  }]);
  expect(client.msearch).toHaveBeenCalledWith({
    body: [
      {},
      {
        query: {
          query_string: {
            query: '*foo*',
          },
        },
        size: MAX_SIZE / 2,
      },
      { index: 'foobar' },
      {
        query: {
          query_string: {
            query: '*bar*',
          },
        },
        size: MAX_SIZE / 2,
      },
    ],
  });
});


it('should not search many empty queries', async () => {
  try {
    await search.msearch();
    expect(true).not.toBe(true);
  } catch (e) {
    expect(e.message).toBe('`queries` must not be empty');
  }
});
