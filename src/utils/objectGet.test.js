import objectGet from './objectGet';

it('should get object data from path', () => {
  const obj = {
    foo: {
      bar: {
        babar: 'babar',
      },
    },
  };
  expect(objectGet(obj, 'foo.bar.babar')).toBe('babar');
});

it('should not crash when reading undefined object', () => {
  const obj = {
    foo: {
      bar: {
        babar: 'babar',
      },
    },
  };
  expect(objectGet(obj, 'ba.bar.lelefan')).not.toBeDefined();
});
