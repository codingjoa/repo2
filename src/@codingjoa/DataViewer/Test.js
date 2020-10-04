import React, { useContext } from 'react';
import { Master, DataViewer } from './Master';

import { SearchBar, SearchButton } from './component/Searcher';


export default () => (
  <DataViewer>
    <Test />
  </DataViewer>
);

function Test() {
  const { searchKeyword } = useContext(Master);
  return (
    <>
      {searchKeyword}
      <SearchBar /><SearchButton />
    </>
  );
}
