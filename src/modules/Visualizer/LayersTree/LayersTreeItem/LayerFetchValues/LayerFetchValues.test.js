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
  const fetchPropertiesValues = jest.fn();
  const layer = {};
  const instance = new LayerFetchValues({ fetchPropertiesValues, layer });
  const property = {
    fetchValues: true,
  };
  instance.fetchValues();
  expect(fetchPropertiesValues).not.toHaveBeenCalled();

  instance.props.layer.filters = { layer: 'foo' };
  instance.fetchValues();
  expect(fetchPropertiesValues).not.toHaveBeenCalled();

  instance.props.layer.filters.form = [{ values: [] }];
  instance.fetchValues();
  expect(fetchPropertiesValues).not.toHaveBeenCalled();

  instance.props.layer.filters.form = [property];
  instance.fetchValues();
  expect(fetchPropertiesValues).toHaveBeenCalledWith('foo', [property]);
});

it('should render nothing', () => {
  const instance = new LayerFetchValues({});
  expect(instance.render()).toBeNull();
});
