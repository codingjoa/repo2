import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Page from '../../Templates/Page';
import { Context } from './Context';
import Search from './Search';

export default function({ list }) {
  const { pickQuarter } = React.useContext(Context);
  const [ searchKeyword, setSearchKeyword ] = React.useState('');
  const filtering = React.useCallback(value => {
/* @codingjoa
   RegExp(정규식)을 이용하기 때문에
   중간, 끝 문자 일치시에도 불러올 수 있어요.
*/
    const rg = new RegExp(searchKeyword ?? '', 'gi');
    return rg.test(value.quarterName);
  }, [ searchKeyword ]);

  return (
    <>
      <Search setSearchKeyword={setSearchKeyword} />
      {list && list.filter(filtering).map(({ quarterID, quarterName }) => <Page>
        <Box display="flex" flexDirection="row" flexWrap="noWrap">
          <Box alignSelf="center" flexGrow={1}>{quarterName}</Box>
          <Box><Button onClick={e => pickQuarter(quarterID)}>선택</Button></Box>
        </Box>
      </Page>)}
    </>
  );
}
