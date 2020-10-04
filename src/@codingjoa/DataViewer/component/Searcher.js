import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';

import { Master } from '../Master';

export function SearchBar() {
  const { TextFieldRef } = useContext(Master);
  return (
    <TextField fullwidth margin="none" label="이름으로 검색" type="text" inputRef={TextFieldRef} name="search" />
  );
}

export function SearchButton() {
  const { TextFieldRef, setSearchKeyword } = useContext(Master);
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={e => setSearchKeyword(TextFieldRef.current?.value ?? '')}
      endIcon={<SearchIcon />}
    >
      검색
    </Button>
  );
}
