import React, { useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import Page from '../../Templates/Page';

export default function Search({ setSearchKeyword }) {
  const keyword = useRef();
  return (
    <Page>
      <Box display="flex">
        <Box flexGrow={1}>
          <TextField fullwidth margin="none" label="이름으로 검색" type="text" inputRef={keyword} name="search" />
        </Box>
        <Box alignSelf="center">
          <Button
            variant="contained"
            color="primary"
            onClick={e => setSearchKeyword(keyword.current?.value ?? '')}
            endIcon={<SearchIcon />}
          >
            검색
          </Button>
        </Box>
      </Box>
    </Page>
  );
}
