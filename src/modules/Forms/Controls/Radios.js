import React from 'react';

import { RadioGroup as BPRadioGroup, Radio as BPRadio } from '@blueprintjs/core';

export const Radios = ({
  sublayers,
  onSelectionChange,
  selectedValue,
}) => (
  <BPRadioGroup
    onChange={onSelectionChange}
    selectedValue={selectedValue}
  >
    {sublayers.map(({ label }, k) => (
      <BPRadio
        key={label}
        label={label}
        value={k}
      />
    ))}
  </BPRadioGroup>
);

export default Radios;
