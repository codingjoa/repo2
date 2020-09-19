import React, { useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';


export default function Search({ setSearchKeyword }) {
  const keyword = useRef();
  return (
    <>
      <TextField label="검색" type="text" inputRef={keyword} name="search" /><br/>
      <Button
        variant="contained"
        color="primary"
        onClick={e => setSearchKeyword(keyword.current?.value ?? '')}
        endIcon={<SearchIcon />}
      >
        검색
      </Button>
    </>
  );
}
