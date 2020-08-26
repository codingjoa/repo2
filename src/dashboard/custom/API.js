import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useSession() {
  const [ data, setData ] = useState({});

  const refreshSession = useCallback(() => {
    axios.get('/api/db/student').then(setData).catch(() => {});
  });

  useEffect(() => {
    axios.get('/api/db/student').then(setData).catch(() => {});
  }, []);

  const createUser = useCallback((name, ) => {
    axios.post('/api/db/student', {id, pw})
    .then(r => {
      if(r.data?.message) alert(r.data.message);
    })
    .then(refreshSession);
  }, []);

  return { data, refreshData, createUser };
}
