import React, { useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';


export default function Search({ setSearchKeyword }) {
  const keyword = useRef();
  return (
    <>
      <>
        <>
          <div style={{ display: 'inline', verticalAlign: 'bottom' }}>
            <TextField fullwidth margin="none" label="이름으로 검색" type="text" inputRef={keyword} name="search" />
          </div>
          <div style={{ display: 'inline', verticalAlign: 'bottom' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={e => setSearchKeyword(keyword.current?.value ?? '')}
              endIcon={<SearchIcon />}
            >
              검색
            </Button>
          </div>
        </>
      </>
    </>
  );
}
