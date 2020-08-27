const [ state, setState ] = useState(null);
  const location = useLocation();
  useEffect(() => {
    axios.get('/api/auth').then(r => r.data).then(setAuth);
  }, [ location ]);
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
