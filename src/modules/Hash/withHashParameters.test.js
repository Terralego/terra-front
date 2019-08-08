import withHashParameters from './withHashParameters';

const Component = jest.fn(() => null);

it('should get correct parameters', () => {
  const ComponentWithHash = withHashParameters('myparam')(Component);
  const instance = new ComponentWithHash();

  window.location.hash = '#myparam=1';
  expect(instance.getHashParameters()).toEqual({ myparam: 1 });

  window.location.hash = '#myparam=1&foo=bar';
  expect(instance.getHashParameters()).toEqual({ myparam: 1 });
});

it('parameters should be versatile', () => {
  const ComponentWithHash = withHashParameters(['myparam'])(Component);
  const instance = new ComponentWithHash();

  window.location.hash = '#myparam=1';
  expect(instance.getHashParameters()).toEqual({ myparam: 1 });
});

it('should set correct parameters', () => {
  const ComponentWithHash = withHashParameters('myparam')(Component);
  const instance = new ComponentWithHash();

  window.location.hash = '';
  instance.setHashParameters({ myparam: 1 });
  expect(window.location.hash).toEqual('#myparam=1');

  window.location.hash = '#foo=bar';
  instance.setHashParameters({ myparam: 1 });
  expect(window.location.hash).toEqual('#foo=bar&myparam=1');

  window.location.hash = '#foo=bar';
  instance.setHashParameters({ myparam: 0, baz: 1 });
  expect(window.location.hash).toEqual('#foo=bar&myparam=0');
});
