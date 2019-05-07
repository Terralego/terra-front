import React from 'react';
import { Card, InputGroup, Button } from '@blueprintjs/core';

export const SearchInput = ({
  onChange,
  query,
  onClose,
  onKeyPress,
  onFocus,
  loading,
}) => (
  <Card className="search-input">
    <InputGroup
      onFocus={onFocus}
      onChange={onChange}
      onKeyDown={onKeyPress}
      value={query}
      rightElement={(
        <Button
          type="button"
          icon="small-cross"
          loading={loading}
          onClick={onClose}
        />
      )}
    />
  </Card>
);

export default SearchInput;
