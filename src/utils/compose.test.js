import compose from './compose';

it('should compose correctly', () => {
  const MyComponent = () => {};

  expect(compose()(MyComponent)).toBe(MyComponent);

  const comp1 = wrapped => wrapped;
  expect(compose(comp1)(MyComponent)).toBe(comp1(MyComponent));

  const comp2 = wrapped => wrapped;
  expect(compose(comp1, comp2)(MyComponent)).toBe(comp1(comp2(MyComponent)));
});
