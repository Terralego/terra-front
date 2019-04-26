import { onKeyPress } from './event';

it('should prevent event Enter', () => {
  const preventDefault = jest.fn();

  onKeyPress({ key: 'Enter', preventDefault });
  expect(preventDefault).toHaveBeenCalled();

  preventDefault.mockClear();

  onKeyPress({ which: 31, preventDefault });
  expect(preventDefault).not.toHaveBeenCalled();
});
