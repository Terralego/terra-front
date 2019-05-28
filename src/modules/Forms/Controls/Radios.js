import React from 'react';

import { RadioGroup, Radio } from '@blueprintjs/core';

export const Radios = ({
  sublayers,
  onChange,
  value,
}) => (
  <RadioGroup
    onChange={onChange}
    selectedValue={value}
  >
    {sublayers.map(({ label }, k) => (
      <Radio
        key={label}
        label={label}
        value={k}
      />
    ))}
  </RadioGroup>
);

export default Radios;
