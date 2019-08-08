import withHashState from './withHashState';

const Component = jest.fn(() => null);

it('should get correct parameters', () => {
  const ComponentWithHash = withHashState('myparam')(Component);
  const instance = new ComponentWithHash();

  window.location.hash = '#myparam=1';
  expect(instance.getInitialState()).toEqual({ myparam: 1 });

  window.location.hash = '#myparam=1&foo=bar';
  expect(instance.getInitialState()).toEqual({ myparam: 1 });
});

it('parameters should be versatile', () => {
  const ComponentWithHash = withHashState(['myparam'])(Component);
  const instance = new ComponentWithHash();

  window.location.hash = '#myparam=1';
  expect(instance.getInitialState()).toEqual({ myparam: 1 });
});

it('should set correct parameters', () => {
  const ComponentWithHash = withHashState('myparam')(Component);
  const instance = new ComponentWithHash();

  window.location.hash = '';
  instance.setCurrentState({ myparam: 1 });
  expect(window.location.hash).toEqual('#myparam=1');

  window.location.hash = '#foo=bar';
  instance.setCurrentState({ myparam: 1 });
  expect(window.location.hash).toEqual('#foo=bar&myparam=1');

  window.location.hash = '#foo=bar';
  instance.setCurrentState({ myparam: 0, baz: 1 });
  expect(window.location.hash).toEqual('#foo=bar&myparam=0');
});
