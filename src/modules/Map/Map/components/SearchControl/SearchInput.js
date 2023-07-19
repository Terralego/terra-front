import React from 'react';
import { Card, InputGroup, Button } from '@blueprintjs/core';

export const SearchInput = ({
  query,
  onClose,
  onKeyPress,
  loading,
  ...props
}) => (
  <Card className="search-input">
    <InputGroup
      onKeyDown={onKeyPress}
      value={query}
      rightElement={(
        <Button
          icon="small-cross"
          minimal
          loading={loading}
          onClick={onClose}
        />
      )}
      {...props}
    />
  </Card>
);

export default SearchInput;
