import LayerFetchValues from './LayerFetchValues';

it('should fetch values on mount', () => {
  const instance = new LayerFetchValues({});
  instance.fetchValues = jest.fn();
  instance.componentDidMount();
  expect(instance.fetchValues).toHaveBeenCalled();
});

it('should fetch values on update', () => {
  const instance = new LayerFetchValues({});
  instance.fetchValues = jest.fn();
  instance.componentDidUpdate({});
  expect(instance.fetchValues).not.toHaveBeenCalled();
  instance.componentDidUpdate({ layer: {} });
  expect(instance.fetchValues).toHaveBeenCalled();
});

it('should fetch values', () => {
  const instance = new LayerFetchValues({
    layer: {
      filters: {
        layer: 'foo',
        form: [{
          type: 'single',
          property: 'single',
        }, {
          type: 'many',
          property: 'many',
        }, {
          type: 'range',
          property: 'range',
        }],
      },
    },
  });
  instance.fetchEnum = jest.fn();
  instance.fetchRange = jest.fn();
  instance.fetchValues();
  expect(instance.fetchEnum).toHaveBeenCalledTimes(2);
  expect(instance.fetchEnum).toHaveBeenCalledWith('foo', {
    type: 'single',
    property: 'single',
  });
  expect(instance.fetchEnum).toHaveBeenCalledWith('foo', {
    type: 'many',
    property: 'many',
  });
  expect(instance.fetchRange).toHaveBeenCalledTimes(1);
  expect(instance.fetchRange).toHaveBeenCalledWith('foo', {
    type: 'range',
    property: 'range',
  });

  instance.fetchEnum.mockClear();
  instance.fetchRange.mockClear();
  instance.props.layer = {};
  instance.fetchValues();
  expect(instance.fetchEnum).not.toHaveBeenCalled();
  expect(instance.fetchRange).not.toHaveBeenCalled();
});

it('should fetch enum', () => {
  const fetchPropertyValues = jest.fn();
  const instance = new LayerFetchValues({ fetchPropertyValues });
  const layer = 'foo';
  const property = {
    fetchValues: true,
  };
  instance.fetchEnum(layer, {});
  expect(fetchPropertyValues).not.toHaveBeenCalled();
  instance.fetchEnum(layer, { values: [] });
  expect(fetchPropertyValues).not.toHaveBeenCalled();
  instance.fetchEnum(layer, property);
  expect(fetchPropertyValues).toHaveBeenCalledWith('foo', property);
});

it('should fetch range', () => {
  const fetchPropertyRange = jest.fn();
  const instance = new LayerFetchValues({ fetchPropertyRange });
  const layer = 'foo';
  const property = {
    fetchValues: true,
  };
  instance.fetchRange(layer, {});
  expect(fetchPropertyRange).not.toHaveBeenCalled();
  instance.fetchRange(layer, { min: 0 });
  expect(fetchPropertyRange).not.toHaveBeenCalled();
  instance.fetchRange(layer, property);
  expect(fetchPropertyRange).toHaveBeenCalledWith('foo', property);
});

it('should render nothing', () => {
  const instance = new LayerFetchValues();
  expect(instance.render()).toBeNull();
});
