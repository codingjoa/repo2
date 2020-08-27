import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useAPI() {
  const [ data, setData ] = useState({});
  const [ alram, setAlram ] = useState(null);

  const getAPI = useCallback((link) => {
    axios.get(`/api/${link}`).then(setData).catch(() => {});
  });
  //const postAPI = 

  useEffect(() => {
    axios.get('/api/db/student').then(setData).catch(() => {});
  }, []);
  useEffect(() => {
    alert(alram?.message);
  }, alram);
/*
  const createUser = useCallback((name, ) => {
    axios.post('/api/db/student', {id, pw})
    .then(r => {
      if(r.data?.message) alert(r.data.message);
    })
    .then(refreshSession);
  }, []);
*/
  return { data, refreshData, createUser };
}
